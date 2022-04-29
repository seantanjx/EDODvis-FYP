from django.urls import path
from .views.user import create_user, get_user_by_token, login, logout, user_state
from .views.participant import create_participant, get_all_participants, get_participant_by_id, get_participant_by_postal_district, get_participant_by_postal_code, get_participants_with_alerts, upload_participant_csv
from .views.device import get_devices_by_participant_id, get_all_devices, get_houses_data_by_area, get_alert_table_data_by_area, get_all_devices_and_days_down, get_devices_overview_data, update_last_service, update_remarks
from .views.sensorreading import get_biomarker_between, get_boxplot, plot_boxplot
from .views.updates import perform_daily_update, perform_device_status_update, health_check

urlpatterns = [
    # user
    path('user/create/', create_user, name='create_user'),
    path('user/login/', login, name="login"),
    path('user/profile/', get_user_by_token, name="get_user_by_token"),
    path('user/logout/', logout, name="logout"),
    path('user/state/', user_state, name="user_state"),

    # participant
    path('participant/all/', get_all_participants, name="get_all_participants"),
    path('participant/<int:participant_id>/', get_participant_by_id, name="get_participant_by_id"),
    path('participant/postal_district/', get_participant_by_postal_district, name="get_participant_by_postal_district"),
    path('participant/postal_code/', get_participant_by_postal_code, name="get_participant_by_postal_code"),
    path('participant/alerts/', get_participants_with_alerts, name="get_participants_with_alerts"),
    path('participant/upload/', upload_participant_csv, name="upload_participant_csv"),

    # devices
    path('device/all/', get_all_devices, name="get_all_devices"),
    path('device/<int:participant_id>/', get_devices_by_participant_id, name="get_devices_by_participant_id"),
    path('device/overview/', get_devices_overview_data, name="get_devices_overview_data"),
    path('device/all/daysdown/', get_all_devices_and_days_down, name="get_all_devices_and_days_down"),
    path('device/houses/', get_houses_data_by_area, name="get_houses_data_by_area"),
    path('device/alert/', get_alert_table_data_by_area, name="get_alert_table_data_by_area"),
    path('device/update/last-serviced/', update_last_service, name="update_last_service"),
    path('device/update/remarks/', update_remarks, name="update_remarks"),
    
    # sensor reading
    path('sensorreading/data/', get_biomarker_between, name="get_biomarker_between"),
    path('sensorreading/data/boxplot/', get_boxplot, name="get_boxplot"),
    path('sensorreading/plot/boxplot/', plot_boxplot, name="plot_boxplot"),
    
    #updates
    path('update/daily-update/', perform_daily_update, name="perform_daily_update"),
    path('update/device-status/', perform_device_status_update, name="update_device_status"),
    
    #healthcheck
    path('healthcheck/', health_check, name="health_check")
]
