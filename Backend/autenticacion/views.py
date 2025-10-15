from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import check_password
from .models import Usuario
from .serializers import UsuarioSerializer

# === Registro ===
@api_view(['POST'])
def registrar_usuario(request):
    serializer = UsuarioSerializer(data=request.data)
    if serializer.is_valid():
        usuario = serializer.save()
        token, _ = Token.objects.get_or_create(user=usuario)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# === Login ===
@api_view(['POST'])
def login_usuario(request):
    correo = request.data.get('Correo')
    contrasena = request.data.get('Contrasena')

    try:
        usuario = Usuario.objects.get(Correo=correo)
    except Usuario.DoesNotExist:
        return Response({'error': 'Correo no registrado'}, status=status.HTTP_404_NOT_FOUND)

    if check_password(contrasena, usuario.Contrasena):
        token, _ = Token.objects.get_or_create(user=usuario)
        return Response({'token': token.key})
    else:
        return Response({'error': 'Contraseña incorrecta'}, status=status.HTTP_400_BAD_REQUEST)
