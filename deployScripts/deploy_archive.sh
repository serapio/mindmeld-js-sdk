#! /usr/bin/env bash
set -x # use + to only "echo" results on console (ie turn debugging off)
set -e # exit if there are any errors at all (perfect build or none at all).

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

ZIP_FILE_NAME=mindmeld-js-sdk-${ARCHIVE_VERSION}.zip
JS_FILE_NAME=mindmeld-${ARCHIVE_VERSION}.js
JS_MIN_FILE_NAME=mindmeld-${ARCHIVE_VERSION}.min.js
aws $PROFILE s3 cp \
  "$ROOT_DIR/archive/$JS_FILE_NAME" \
  "$ROOT_DIR/archive/$JS_MIN_FILE_NAME" \
  "$ROOT_DIR/archive/$ZIP_FILE_NAME" \
  "s3://elabs-archive/js-sdk/$ARCHIVE_VERSION/"
