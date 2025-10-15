from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Usuario
from .serializers import UsuarioSerializer


@api_view(['POST'])
def registrar_usuario(request):
    serializer = UsuarioSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'mensaje': 'Usuario registrado correctamente'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def login_usuario(request):
    correo = request.data.get('Correo')
    contrasena = request.data.get('Contrasena')

    try:
        usuario = Usuario.objects.get(Correo=correo)
        if usuario.verificar_contrasena(contrasena):
            return Response({
                'mensaje': 'Login exitoso',
                'usuario': {
                    'Id': usuario.Id,
                    'Nombre': usuario.Nombre,
                    'Apellidos': usuario.Apellidos,
                    'Correo': usuario.Correo
                }
            })
        else:
            return Response({'error': 'Contraseña incorrecta'}, status=status.HTTP_401_UNAUTHORIZED)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

