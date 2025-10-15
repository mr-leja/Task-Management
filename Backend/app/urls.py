from django.urls import path
from . import views

urlpatterns = [
    path('tareas/', views.listar_tareas, name='listar_tareas'),  # 👈 agregado "/"
    path('tareas/crear/', views.crear_tarea, name='crear_tarea'),
    path('tareas/<int:pk>/actualizar/', views.actualizar_tarea, name='actualizar_tarea'),
    path('tareas/<int:pk>/eliminar/', views.eliminar_tarea, name='eliminar_tarea'),
]
