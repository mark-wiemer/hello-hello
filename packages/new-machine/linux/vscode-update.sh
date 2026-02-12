#!/bin/bash

url="https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64"
display_name="VS Code"
name="code"
debname="vscode.deb"
tmpdir=$(mktemp -d /tmp/vscode-update.XXXXXX)

cd $tmpdir

# echo Killing all processes called $name
# for KILLPID in `ps ax | grep $name | awk ' { print $1;}'`; do
#  kill -9 $KILLPID &> /dev/null
# done

echo
echo Getting latest version of $name from $url
wget -q --show-progress -O $debname $url

echo
echo Installing $debname
sudo dpkg -i $debname

echo
echo Cleaning up
rm -r $tmpdir

echo
echo Finished updating $display_name
