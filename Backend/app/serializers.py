from rest_framework import serializers
from .models import Tarea

class TareaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarea
        fields = ['Id', 'Titulo', 'descripcion', 'FechaVence', 'Estado', 'IdUsuario']
        read_only_fields = ['IdUsuario']  # 👈 No se enviará desde el frontend
