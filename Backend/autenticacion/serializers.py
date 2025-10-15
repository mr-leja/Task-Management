from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['Id', 'Nombre', 'Apellidos', 'Correo', 'Contrasena']
        extra_kwargs = {'Contrasena': {'write_only': True}}
