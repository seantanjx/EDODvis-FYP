# Script to load environment variables in a .env file
# Must be sourced instead of executed
if [[ "$(basename -- "$0")" == "dotenv.sh" ]]; then
    echo "Don't run dotenv.sh, source it instead!" >&2
    exit 1
fi

# Export the vars in .env into this shell
export $(egrep -v '^#' .env | xargs)
