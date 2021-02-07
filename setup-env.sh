case $CIRCLE_BRANCH in
    "main")
        export TELEGRAM_KEY=$TELEGRAM_KEY_PRD
        ;;
    *)
        export TELEGRAM_KEY=$TELEGRAM_KEY_DEV
        ;;
esac