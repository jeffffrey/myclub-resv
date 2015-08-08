#!/bin/bash
USERNAME=$1
PASSWORD=$2
DATE=`date +%F`
LOGFILE=/home/ubuntu/workspace/p.myclub/logs/run_${USERNAME}_${DATE}.log
count=1


echo $USERNAME
echo $PASSWORD

echo "scheduled task running.."
echo `date`
/usr/local/bin/casperjs /home/ubuntu/workspace/p.myclub/myclub.js --username=$USERNAME --password=$PASSWORD >> $LOGFILE


while ! grep -q "Course Selected" $LOGFILE && [ $count -le 120 ]
do
   echo " do it again..."
   /usr/local/bin/casperjs /home/ubuntu/workspace/p.myclub/myclub.js --username=$USERNAME --password=$PASSWORD >> $LOGFILE
   (( count++ ))
done

