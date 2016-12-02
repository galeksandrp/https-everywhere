ESCAPED=$(echo $1 | sed 's/\./\\./g')
FILE=$2
if [ -z "$2" ];
then
   FILE="$1.xml"
   # git checkout master -f
   # git clean -fd
   # git branch -D $1
   # git checkout -b $1
   git checkout $1 -f || git checkout -b $1 master -f
   git clean -fd
   # if [ -f "$FILE" ];
   # then
   #    echo "File exists."
   #    exit 1
   # fi
fi
RED=$(tput setaf 1)
RESET=$(tput sgr0)
#curl --connect-timeout 10 -i -I "https://$1" | grep 'Strict-Transport-Security: ' && exit 1 || ~/workspace/phantomjs-2.1.1-linux-x86_64/bin/phantomjs ~/workspace/lol.js $1 > "$FILE"
if [[ $(curl "https://api.github.com/repos/EFForg/https-everywhere/pulls?client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&head=galeksandrp:$1" | sha256sum) != $(echo -e '[\n\n]' | sha256sum) ]]; then
   echo ${RED}Branch already exist${RESET}
fi
#~/workspace/phantomjs-2.1.1-linux-x86_64/bin/phantomjs ~/workspace/lol.js $1 > "$FILE"
echo "<ruleset name=\"$1 (partial)\">
	<target host=\"$1\" />" > "$FILE"
~/workspace/Sublist3r/sublist3r.py -d $1 | grep "\.$ESCAPED" | sed -r "s/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]//g" | xargs -n1 -i echo -e '\t<target host="{}" />' >> "$FILE"
echo '
	<rule from="^http:" to="https:" />
</ruleset>' >> "$FILE"
#c9 "$FILE"
#git add .
~/workspace/check.sh "$FILE" $1
#git diff $(git rev-parse --abbrev-ref HEAD)
