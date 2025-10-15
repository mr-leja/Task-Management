from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Tarea
from .serializers import TareaSerializer

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def listar_tareas(request):
    tareas = Tarea.objects.filter(IdUsuario=request.user.id).order_by('-Id')
    serializer = TareaSerializer(tareas, many=True)
    return Response(serializer.data)

# === Crear tarea (vinculada al usuario autenticado) ===
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def crear_tarea(request):
    data = request.data.copy()
    data['IdUsuario'] = request.user.id
    serializer = TareaSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# === Actualizar tarea (solo propietario) ===
@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def actualizar_tarea(request, pk):
    try:
        tarea = Tarea.objects.get(pk=pk, IdUsuario=request.user.id)
    except Tarea.DoesNotExist:
        return Response({'error': 'No autorizado o tarea no existe'}, status=403)

    serializer = TareaSerializer(tarea, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# === Eliminar tarea (solo propietario) ===
@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def eliminar_tarea(request, pk):
    try:
        tarea = Tarea.objects.get(pk=pk, IdUsuario=request.user.id)
    except Tarea.DoesNotExist:
        return Response({'error': 'No autorizado o tarea no existe'}, status=403)

    tarea.delete()
    return Response({'mensaje': 'Tarea eliminada'})
