## Участие в разработке HTTPS Everywhere

### Заметки для разработчиков

- **Лицензия:** GPL версии 3+ (однако большинство кода совместимо с GPL-2)
- **Исходный код:** Доступен через Git через `git clone https://github.com/EFForg/https-everywhere.git`. Можете форкать и отправлять пулл реквесты при помощи Github на [https://github.com/EFForg/https-everywhere](https://github.com/EFForg/https-everywhere).
- **Перевод:** Если вы хотите перевести HTTPS Everywhere на другой язык, можете сделать это [на Transifex](https://www.transifex.com/otf/torproject/).
- **Система отслеживания ошибок:** Используйте [трекер GitHub](https://github.com/EFForg/https-everywhere/issues/) или [трекер Tor Project](https://trac.torproject.org/projects/tor/report/19). На трекере Tor Project вы можете создать аккаунт или использовать анонимный — "cypherpunks"/"writecode". Вы не будете получать ответы пока не вставите адрес электронной почты в поле CC. Ошибки, вызываемые списками правил должны быть помечены тегом "httpse-ruleset-bug", и могут быть увидены [в этом отчете](https://trac.torproject.org/projects/tor/report/48).
- **Списки рассылки:** Список [https-everywhere](https://lists.eff.org/mailman/listinfo/https-everywhere) ([архивы](https://lists.eff.org/pipermail/https-everywhere/)) создан для обсуждения всего проекта; список рассылки [https-everywhere-rules](https://lists.eff.org/mailman/listinfo/https-everywhere-rules) ([архивы](https://lists.eff.org/pipermail/https-everywhere-rules)) для обсуждения [списков правил](https://www.eff.org/https-everywhere/rulesets) и их содержимого, включая патчи и пулл реквесты.
- **IRC:** `#https-everywhere` on `irc.oftc.net`. If you ask a question, be sure to stay in the channel — someone may reply a few hours or a few days later.

### Тестирование и слияние изменений исходного кода

HTTPS Everywhere состоит из большого числа правил перенаправления сайтов с HTTP на HTTPS. Вы можете прочитать больше о том как создавать эти правила [здесь](https://www.eff.org/https-everywhere/rulesets).

Если вы хотите создавать правила, чтобы отправить их нам, мы ожидаем увидеть их в директории src/chrome/content/rules. Эта директория также содержит полезный скрипт, make-trivial-rule, для создания простого правила для определенного домена. Также в ней есть скрипт названный trivial-validate.py, для проверки всех поступающих правил на некоторые общие ошибки и опечатки. Например, если вы хотите создать правило для домена example.com, вы можете запустить

    bash ./make-trivial-rule example.com

inside the rules directory. This would create Example.com.xml, which you could then take a look at and edit based on your knowledge of any specific URLs at example.com that do or don't work in HTTPS.

Before submitting your change, you should test it in Firefox and/or Chrome, as applicable. You can build the latest version of the extension and run it in a standalone Firefox profile using:

    bash ./test.sh --justrun

Similarly, to build and run in a standalone Chromium profile, run:

    bash ./run-chromium.sh

You should thoroughly test your changes on the target site: Navigate to as wide a variety of pages as you can find. Try to comment or log in if applicable. Make sure everything still works properly.

After running your manual tests, run the automated tests and the fetch tests:

    bash ./test.sh

    bash ./fetch-test.sh

This will catch some of the most common types of errors, but is not a guaranteed of correctness.

Once you've tested your changes, you can submit them for review via any of the following:

- Open a pull request at [https://github.com/EFForg/https-everywhere](https://github.com/EFForg/https-everywhere).
- Email https-everywhere-rules@eff.org to tell us about your changes. You can use the following command to create a patch file: `git format-patch`

### A quick HOWTO on working with Git

You may want to also look at the [Git Reference](http://gitref.org/), [GitHub Help Site](https://help.github.com/) and the [Tor Project's Git documentation](https://gitweb.torproject.org/githax.git/tree/doc/Howto.txt) to fill in the gaps here, but the below should be enough to get the basics of the workflow down.

First, tell git your name:

    git config --global user.name "Your Name"   git config --global user.email "you@example.com"

Then, get a copy of the 'origin' repository:

    git clone https://github.com/EFForg/https-everywhere.git
    cd https-everywhere

Alternatively, if you already have a Github account, you can create a "fork" of the repository on Github at [https://github.com/EFForg/https-everywhere](https://github.com/EFForg/https-everywhere). See [this page](https://help.github.com/articles/fork-a-repo) for a tutorial.

Once you have a local copy of the repository, create a new branch for your changes and check it out:

    git checkout -b my-new-rules master

When you want to send us your work, you'll need to add any new files to the index with git add:

    git add ./src/chrome/content/rules/MyRule1.xml
    git add ./src/chrome/content/rules/MyRule2.xml

You can now commit your changes to the local branch. To make things easier, you should commit each xml file individually:

    git commit ./src/chrome/content/rules/MyRule1.xml
    git commit ./src/chrome/content/rules/MyRule2.xml

Now, you need a place to publish your changes. You can create a github account here: [https://github.com/join](https://help.github.com/). [https://help.github.com/](https://help.github.com/) describes the account creation process and some other github-specific things.

Once you have created your account and added your remote in your local checkout, you want to push your branch to your github remote:

    git push github my-new-rules:my-new-rules

Periodically, you should re-fetch the master repository:

    git pull master
