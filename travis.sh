#!/bin/bash
# Wrapper for travis tests

function docker_build {
  docker build -t httpse .
}

# Folder paths, relative to parent
RULESETFOLDER="src/chrome/content/rules"

# Go to git repo root; taken from ../test.sh. Note that
# $GIT_DIR is .git in this case.
if [ -n "$GIT_DIR" ]
then
  # $GIT_DIR is set, so we're running as a hook.
  cd $GIT_DIR
  cd ..
else
  # Git command exists? Cool, let's CD to the right place.
  git rev-parse && cd "$(git rev-parse --show-toplevel)"
fi

# Fetch the current GitHub version of HTTPS-E to compare to its master
if [[ $(git diff --name-only HEAD) ]]; then
    RULESETS_CHANGED=$(git diff --name-only HEAD | grep $RULESETFOLDER | grep '.xml')
else
    RULESETS_CHANGED=$(git diff --name-only master | grep $RULESETFOLDER | grep '.xml')
fi
if [ "$(git diff --name-only $COMMON_BASE_COMMIT)" != "$RULESETS_CHANGED" ]; then
  ONLY_RULESETS_CHANGED=false
fi

# At this point, if anything fails, the test should fail
set -e

# Only run test if something has changed.
if [ "$RULESETS_CHANGED" ]; then
    echo >&2 "Testing test URLs in all changed rulesets."
    RULESETS_CHANGED="$RULESETS_CHANGED" test/fetch.sh
fi

exit 0
