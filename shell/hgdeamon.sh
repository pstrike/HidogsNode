#!/usr/bin/env bash
CheckProcess()
{
    if [ "$1" = "" ];
    then
        return 1
    fi

    PROCESS_NUM=`ps -ef | grep "$1" | grep -v "grep" | wc -l`

    if [ $PROCESS_NUM -gt 0 ];
    then
        return 0
    else
        return 1
    fi
}

while [ 1 ]; do

    CheckProcess "node /home/ftp/index.js"
    CheckQQ_RET=$?
    if [ $CheckQQ_RET -eq 1 ];
    then
        echo "down"
        killall -9 node
        sudo nohup /usr/local/node/0.12.7/bin/node /home/ftp/index.js &
    else
        echo "ok"
    fi

    sleep 60

done