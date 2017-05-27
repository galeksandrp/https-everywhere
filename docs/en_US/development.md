## Участие в разработке HTTPS Everywhere

### Заметки для разработчиков

- **Лицензия:** GPL версии 3+ (хотя большинство кода совместимо с GPL-2)
- **Исходный код:** Доступен через Git командой `git clone https://github.com/EFForg/https-everywhere.git`. Можете форкать и отправлять пулл реквесты при помощи Github на [https://github.com/EFForg/https-everywhere](https://github.com/EFForg/https-everywhere).
- **Перевод:** Если вы хотите перевести HTTPS Everywhere на другой язык, можете сделать это [на Transifex](https://www.transifex.com/otf/torproject/).
- **Система отслеживания ошибок:** Используйте [трекер GitHub](https://github.com/EFForg/https-everywhere/issues/) или [трекер Tor Project](https://trac.torproject.org/projects/tor/report/19). На трекере Tor Project вы можете создать аккаунт или использовать анонимный — "cypherpunks"/"writecode". Вы не будете получать ответы пока не вставите адрес электронной почты в поле CC. Ошибки, вызываемые списками правил должны быть помечены тегом "httpse-ruleset-bug", и могут быть увидены [в этом отчете](https://trac.torproject.org/projects/tor/report/48).
- **Списки рассылки:** Список [https-everywhere](https://lists.eff.org/mailman/listinfo/https-everywhere) ([архивы](https://lists.eff.org/pipermail/https-everywhere/)) создан для обсуждения всего проекта; список рассылки [https-everywhere-rules](https://lists.eff.org/mailman/listinfo/https-everywhere-rules) ([архивы](https://lists.eff.org/pipermail/https-everywhere-rules)) для обсуждения [списков правил](https://www.eff.org/https-everywhere/rulesets) и их содержимого, включая патчи и пулл реквесты.
- **IRC:** `#https-everywhere` on `irc.oftc.net`. If you ask a question, be sure to stay in the channel — someone may reply a few hours or a few days later.

### Тестирование и слияние изменений исходного кода

HTTPS Everywhere состоит из большого числа правил перенаправления сайтов с HTTP на HTTPS. Вы можете прочитать больше о том как создавать эти правила [здесь](https://www.eff.org/https-everywhere/rulesets).

Если вы хотите создавать правила, чтобы отправить их нам, мы ожидаем увидеть их в директории src/chrome/content/rules. Эта директория также содержит полезный скрипт, make-trivial-rule, для создания простого правила для определенного домена. Также в ней есть скрипт названный trivial-validate.py, для проверки всех поступающих правил на некоторые общие ошибки и опечатки. Например, если вы хотите создать правило для домена example.com, вы можете запустить

    bash ./make-trivial-rule example.com

находясь в директории правил. Команда создаст Example.com.xml, which you could then take a look at and edit based on your knowledge of any specific URLs at example.com that do or don't work in HTTPS.

Прежде чем отправлять свои изменения, вы должны проверить их в Firefox и/или Chrome, если возможно. Вы можете собрать последнюю версию расширения и запустить ее в отдельном профиле Firefox командой:

    bash ./test.sh --justrun

Аналогично, для сборки и запуска в отдельном профиле Chromium, запустите:

    bash ./run-chromium.sh

Вы должны тщательно проверить свои изменения на целевом сайте: Посетите как можно больше страниц которые вы можете найти. Попробуйте оставить комментарий или войти на сайт если возможно. Убедитесь что все по прежнему работает нормально.

Закончив ручные тесты, запустите автоматические тесты и тесты запросов:

    bash ./test.sh

    bash ./fetch-test.sh

Они проверят большинство общих видов ошибок, но не гарантируют абсолютное их отсутствие.

Как только вы протестировали свои изменения, вы можете отправить из на проверку любым из следующих способов:

- Откройте пулл реквест на [https://github.com/EFForg/https-everywhere](https://github.com/EFForg/https-everywhere).
- Пошлите письмо на https-everywhere-rules@eff.org и расскажите нам о своих изменениях. Вы можете использовать следующую команду для создания патча: `git format-patch`

### Быстрая справка по работе с Git

Вы можете также взглянуть на [Git Reference](http://gitref.org/), [GitHub Help Site](https://help.github.com/) и [Tor Project's Git documentation](https://gitweb.torproject.org/githax.git/tree/doc/Howto.txt) для заполнения пробелов в этом тексте, но нижеследующего должно быть достаточно для понимания основ рабочего процесса.

Для начала, назовите git свое имя:

    git config --global user.name "Your Name"   git config --global user.email "you@example.com"

Затем, получите копию 'origin' репозитория:

    git clone https://github.com/EFForg/https-everywhere.git
    cd https-everywhere

Или же, если у вас уже есть аккаунт Github, вы можете создать "fork" репозитория на Github на [https://github.com/EFForg/https-everywhere](https://github.com/EFForg/https-everywhere). Смотрите [эту страницу](https://help.github.com/articles/fork-a-repo) для пояснений.

Как только вы получили локальную копию репозитория, создайте новую ветку для ваших изменений и перейдите на нее:

    git checkout -b my-new-rules master

Если вы хотите отправить нам свою работу, вам следует добавить нужные файлы в индекс командой git add:

    git add ./src/chrome/content/rules/MyRule1.xml
    git add ./src/chrome/content/rules/MyRule2.xml

Теперь вы можете зафиксировать ваши изменения в локальной ветке. Для того, чтобы облегчить задачу, вы должны фиксировать каждый файл отдельно:

    git commit ./src/chrome/content/rules/MyRule1.xml
    git commit ./src/chrome/content/rules/MyRule2.xml

Теперь, вам нужно где то опубликовать ваши изменения. Вы можете создать аккаунт github здесь: [https://github.com/join](https://help.github.com/). [https://help.github.com/](https://help.github.com/) описывает процесс создания аккаунта и некоторые другие специфичные для github вещи.

Как только вы создали аккаунт и добавили ваш удаленный репозиторий в свой локальный репозиторий, вы захотите отправить свою ветку на удаленный репозиторий:

    git push github my-new-rules:my-new-rules

Периодически, вы должны заново получать master репозитория:

    git pull master
