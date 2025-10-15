from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['Id', 'Nombre', 'Apellidos', 'Correo', 'Contrasena']
        extra_kwargs = {'Contrasena': {'write_only': True}}

    def create(self, validated_data):
        user = Usuario(**validated_data)
        user.save()
        return user