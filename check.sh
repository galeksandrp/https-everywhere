DOMAIN=$(echo ${1::${#1}-4} | tr '[:upper:]' '[:lower:]')
if [ -n $2 ]; then
  DOMAIN=$2
fi
ESCAPED=$(echo $DOMAIN | sed 's/\./\\\\./g')
curl --connect-timeout 10 -i -I "https://$DOMAIN" | tr '[:upper:]' '[:lower:]' | grep 'strict-transport-security: ' | grep '; includesubdomains' | grep '; preload' && curl "https://hstspreload.appspot.com/api/v2/status?domain=$DOMAIN" | grep preloaded && exit 1
git add .
~/workspace/travis.sh > ~/workspace/log.txt
grep ERROR ~/workspace/log.txt | sed -f ~/workspace/sed1.xml > ~/workspace/sed.xml
sed -f ~/workspace/sed.xml -i "$1"
grep 'INFO Big distance' ~/workspace/log.txt | sed -f ~/workspace/sed3.xml > ~/workspace/sed.xml
sed -f ~/workspace/sed.xml -i "$1"
perl -p -e 's/^replace\n//' -i "$1"
echo '<!--' > "/tmp/$1"
grep ERROR ~/workspace/log.txt | sed -f ~/workspace/sed2.xml >> "/tmp/$1"
perl -p -e 's/^.* nonexist\n//' -i "/tmp/$1"
grep 'INFO Big distance' ~/workspace/log.txt | sed -f ~/workspace/sed4.xml >> "/tmp/$1"
echo -e '\n' >> "/tmp/$1"
grep ' ¹' "/tmp/$1" && echo '¹ mismatch' >> "/tmp/$1"
grep ' ²' "/tmp/$1" && echo '² refused' >> "/tmp/$1"
grep ' ³' "/tmp/$1" && echo '³ timed out' >> "/tmp/$1"
grep ' ⁴' "/tmp/$1" && echo '⁴ self signed' >> "/tmp/$1"
grep ' ⁵' "/tmp/$1" && echo '⁵ expired' >> "/tmp/$1"
grep ' ⁶' "/tmp/$1" && echo '⁶ redirect' >> "/tmp/$1"
grep ' ⁷' "/tmp/$1" && echo '⁷ protocol error' >> "/tmp/$1"
xmllint --xpath '//ruleset[not(@platform)]/target' $1 | sed 's/<target host=\"//g' | sed 's&\"/>&\n&g' | grep -v '*' | xargs -n1 -i bash -c 'check-mixed-content --depth=1 --url {} > /dev/null || echo {}' > /tmp/mixed
cat /tmp/mixed | xargs -n1 -i sed 's&<target host="{}" />&replace&' -i $1
perl -p -e 's/^replace\n//' -i "$1"
cat /tmp/mixed | sed 's/$/ mixed content/' >> "/tmp/$1"
echo '-->' >> "/tmp/$1"
# perl -0 -p -e 's/<!--\n\n\n-->\n//' -i "/tmp/$1"
if [ "$(cat "/tmp/$1" | sha256sum)" != "7e406daa6b81f6f133b0015c9477849d121b31d39cec8b11876f59755e8325be  -" ]; then
  cat "$1" >> "/tmp/$1"
  mv "/tmp/$1" "$1"
fi
grep "<target host=\"$DOMAIN\" />" "$1" || grep "<target host=\"www\.$DOMAIN\" />" "$1" || exit 0
grep "<target host=\"www\.$DOMAIN\" />" "$1" || sed "s&<rule from=\"^http:\" to=\"https:\" />&<target host=\"www\.$DOMAIN\" />\n\n\t<rule from=\"^http://www\\\\.$ESCAPED/\"\n\t\tto=\"https://$DOMAIN/\" />\n\n\t<rule from=\"^http:\" to=\"https:\" />&" -i "$1"
grep "<target host=\"$DOMAIN\" />" "$1" || sed "s&<rule from=\"^http:\" to=\"https:\" />&<target host=\"$DOMAIN\" />\n\n\t<rule from=\"^http://$ESCAPED/\"\n\t\tto=\"https://www\.$DOMAIN/\" />\n\n\t<rule from=\"^http:\" to=\"https:\" />&" -i "$1"
grep "<target host=\"$DOMAIN\" />" "$1" && grep "<target host=\"www\.$DOMAIN\" />" "$1" && sed 's/ (partial)">/">/' -i "$1"
