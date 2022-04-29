from pytz import timezone
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

time_zone = timezone('Asia/Singapore')


def get_current_datetime():
    current_datetime = datetime.now(time_zone)
    return current_datetime


def get_yesterday_date():
    '''
    Get yesterday's date as a date object
    '''
    today = get_current_datetime().date()
    yesterday = today - timedelta(days=1)
    return yesterday


def hours_between(d1, d2):
    '''
    Returns number of hours between two datetime.datetime objects
    Return type: int
    '''
    return int(abs((d2 - d1)).total_seconds()/3600)


def hours_between_nonabsolute(d1, d2):
    '''
    Returns number of hours between two datetime.datetime objects
    Return type: int
    '''
    return int((d2 - d1).total_seconds()/3600)


def get_battery_level(battery_percentage):
    '''
    Returns battery level (high, medium, low) when given a battery percentage
    '''
    level = None
    try:
        if battery_percentage > 70:
            level = "high"
        elif battery_percentage > 20:
            level = "medium"
        elif battery_percentage > 0:
            level = "low"
    except:
        print("Invalid battery percenage provided")
    return level


def get_date_of_days_before(days_before=0):
    '''
    Returns date of x days before current date
    Return type: datetime.date
    '''
    return get_current_datetime().date() - timedelta(days=days_before)


def get_days_from_date_before(date):
    '''
    Returns date of x days before current date
    Return type: datetime.date
    '''
    days = (get_current_datetime().date() - date.date()).days
    return days

def date_string_to_date(date_string):
    '''
    Converts '2021-10-05' from string to datetime.date object
    '''
    try:
        return datetime.strptime(date_string, "%Y-%m-%d").date()
    except:
        return None


def date_to_date_string(date):
    '''
    Converts datetime(2022,1,1) to '2022-01-01'
    '''
    try:
        return datetime.strftime(date, "%Y-%m-%d")
    except:
        return None


def get_week_of_date(date):
    return date.isocalendar().week


def get_start_date_of_week(date):
    '''
    Input: Date (datetime.date)
    Returns: Date (start date)
    '''
    try:
        start = date - timedelta(days=date.weekday())
        end = start + timedelta(days=6)
        return start
    except:
        return None


def get_start_date_of_month(date):
    '''
    Input: Datetime (datetime.datetime)
    Returns: First day of month
    '''
    return str(date.replace(day=1))


def get_month_of_date(date):
    '''
    Get month of date
    '''
    return date.month


def get_name_of_month(month_num):
    '''
    Get name of month
    '''
    date = datetime.strptime(month_num, "%m")
    return date.strftime("%b")


def is_valid_start_end_date(start_date, end_date):
    '''
    Input:
        start_date (datetime.datetime)
        end_date (datetime.datetime)
    '''
    return start_date < end_date


def fill_missing_dates(data, start, end, periodicity):
    if periodicity == "month":
        delta = relativedelta(months=1)
    elif periodicity == "week":
        delta = timedelta(days=7)
    else:
        delta = timedelta(days=1)

    while start <= end:
        startdate_string = date_to_date_string(start)
        if startdate_string not in data:
            data[startdate_string] = None
        start += delta
    return data


def do_nothing(input):
    return input


def get_periodicity_method(periodicity):
    if periodicity == "month":
        return get_start_date_of_month
    elif periodicity == "week":
        return get_start_date_of_week
    else:
        return do_nothing

def is_valid_postal_code(postal_code):
    try:
        postal_code = postal_code[1:]
        if len(postal_code) == 6 and postal_code.isdigit() and postal_code[:2] in postal_district_mapping:
            return True
        else:
            return False
    except:
        return False

biomarker_mapping = {
    "heartRate": "heart_rate",
    "steps": "steps",
    "forgottenMedication": "forgotten_medication",
    "forgottenWallet": "forgotten_wallet",
    "forgottenKeys": "forgotten_keys",
    "sleepDuration": "sleep_duration",
    "outings": "outings",
    "awayFromHomeDuration": "away_from_home_duration",
    "frequencyOpenMedbox": "frequency_open_medbox"
}

periodicity_mapping = {
    "month": "month",
    "week": "week",
    "day": "day"
}

postal_district_mapping = {
    '01': 1,
    '02': 1,
    '03': 1,
    '04': 1,
    '05': 1,
    '06': 1,
    '07': 2,
    '08': 2,
    '09': 4,
    '10': 4,
    '11': 5,
    '12': 5,
    '13': 5,
    '14': 3,
    '15': 3,
    '16': 3,
    '17': 6,
    '18': 7,
    '19': 7,
    '20': 8,
    '21': 8,
    '22': 9,
    '23': 9,
    '24': 10,
    '25': 10,
    '26': 10,
    '27': 10,
    '28': 11,
    '29': 11,
    '30': 11,
    '31': 12,
    '32': 12,
    '33': 12,
    '34': 13,
    '35': 13,
    '36': 13,
    '37': 13,
    '38': 14,
    '39': 14,
    '40': 14,
    '41': 14,
    '42': 15,
    '43': 15,
    '44': 15,
    '45': 15,
    '46': 16,
    '47': 16,
    '48': 16,
    '49': 17,
    '50': 17,
    '81': 17,
    '51': 18,
    '52': 18,
    '53': 19,
    '54': 19,
    '55': 19,
    '82': 19,
    '56': 20,
    '57': 20,
    '58': 21,
    '59': 21,
    '60': 22,
    '61': 22,
    '62': 22,
    '63': 22,
    '64': 22,
    '65': 23,
    '66': 23,
    '67': 23,
    '68': 23,
    '69': 24,
    '70': 24,
    '71': 24,
    '72': 25,
    '73': 25,
    '75': 27,
    '76': 27,
    '77': 26,
    '78': 26,
    '79': 28,
    '80': 28
}

area_mapping = {
    5: "west",
    22: "west",
    23: "west",
    24: "north",
    25: "north",
    27: "north",
    19: "north-east",
    20: "north-east",
    28: "north-east",
    15: "east",
    16: "east",
    17: "east",
    18: "east",
    1: "central",
    2: "central",
    3: "central",
    4: "central",
    6: "central",
    7: "central",
    8: "central",
    9: "central",
    10: "central",
    11: "central",
    12: "central",
    13: "central",
    14: "central",
    21: "central",
    26: "central",
}
