from django.contrib import admin
from django.urls import path, include
from edodvis import urls as edodvis_URLs

urlpatterns = [
    path('admin/', admin.site.urls),
    path('edodvis/', include(edodvis_URLs), name="edodvis"),
]
