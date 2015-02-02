#! /usr/bin/env bash
set -x # use + to only "echo" results on console (ie turn debugging off)
set -e # exit if there are any errors at all (perfect build or none at all).

# USAGE:
# bash deployScripts/deploy_archive.sh ARCHIVE_VERSION [AWS_PROFILE]

SCRIPT_DIR=`dirname $0`
ROOT_DIR=`dirname "$SCRIPT_DIR"`

ARCHIVE_VERSION=$1
if [ -z "$ARCHIVE_VERSION" ]; then
  echo "Required to submit an archive version to deploy."
  exit 1
fi

AWS_PROFILE=$2
if [ -n "$AWS_PROFILE" ]; then
  PROFILE="--profile $AWS_PROFILE"
fi
S3CMD="aws $PROFILE s3"

ZIP_FILE_NAME=mindmeld-js-sdk-${ARCHIVE_VERSION}.zip
JS_FILE_NAME=mindmeld-${ARCHIVE_VERSION}.js
JS_MIN_FILE_NAME=mindmeld-${ARCHIVE_VERSION}.min.js
for file in $JS_FILE_NAME $JS_MIN_FILE_NAME $ZIP_FILE_NAME; do
  $S3CMD cp "$ROOT_DIR/archive/$file" \
    "s3://elabs-archive/js-sdk/$ARCHIVE_VERSION/"
done
