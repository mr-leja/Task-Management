from django.urls import path
from . import views

urlpatterns = [
    path('', views.listar_tareas, name='listar_tareas'),
    path('tareas/crear/', views.crear_tarea, name='crear_tarea'),
    path('tareas/<int:pk>/', views.obtener_tarea, name='obtener_tarea'),
    path('tareas/<int:pk>/actualizar/', views.actualizar_tarea, name='actualizar_tarea'),
    path('tareas/<int:pk>/eliminar/', views.eliminar_tarea, name='eliminar_tarea'),
]