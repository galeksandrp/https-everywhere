#xmllint --xpath '//target' $(grep "<target host=\"$1\"" -l *.xml) | sed 's/<target host="//g' | sed 's&"/>&\n&g' | wc ; exit
for DOMAIN in $(xmllint --xpath '//target' "$1" | sed 's/<target host="//g' | sed 's&"/>&\n&g' | grep -v '\*')
do
	curl -s -d test https://www.jitbit.com/checksslcrawlingresults/?url=https://$DOMAIN | grep -v -q 'done' && curl -s -d url=https://$DOMAIN https://www.jitbit.com/sslcheck/ && until (curl -s -d test https://www.jitbit.com/checksslcrawlingresults/?url=https://$DOMAIN | grep -q done); do sleep 3; done

	echo "<root>$(curl -s -d test https://www.jitbit.com/checksslcrawlingresults/?url=https://$DOMAIN | sed 's/<br><br>Pages failed to crawl.*//' | sed 's&<br>https://[^<]* <a>?</a><div>\(http://[^<]*\.\(gif\|png\|jpg\|jpeg\)\(\(\?\|#\).*\)\?\(<br>\)\?\)\+</div>&&g' | sed 's/&/&amp;/g' | sed 's&<br>&<br/>&g')</root>" | xmllint --xpath '//root/text()' - | sed 's&https://&\nhttps://&g' | grep '^https://' | sed 's&https://&http://&' | sed 's/.$//' | sed 's/\?.*//' | sort | uniq | grep -v "^http://$DOMAIN/$" | xargs -i bash -c 'echo "<exclusion pattern=\"$(echo {} | sed s/\\./\\\\./g)\"/><test url=\"{}\"/>"'
done