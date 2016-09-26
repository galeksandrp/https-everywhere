git add .
python ~/workspace/https-everywhere/utils/trivial-validate.py > ~/workspace/log-check2.txt
grep failure ~/workspace/log-check2.txt | sed -f ~/workspace/sed1-check2.xml > ~/workspace/sed-check2.xml
sed -f ~/workspace/sed-check2.xml -i "$1"
perl -p -e 's/^replace\n//' -i "$1"
# echo '<!--' > "/tmp/$1"
# grep failure ~/workspace/log-check2.txt | sed -f ~/workspace/sed2-check2.xml >> "/tmp/$1"
# echo '-->' >> "/tmp/$1"
# cat "$1" >> "/tmp/$1"
# mv "/tmp/$1" "$1"
