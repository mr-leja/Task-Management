from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Tarea
from .serializers import TareaSerializer

@api_view(['GET'])
def listar_tareas(request):
    tareas = Tarea.objects.all().order_by('-Id')
    serializer = TareaSerializer(tareas, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([])
def crear_tarea(request):
    data = request.data.copy()
    data['IdUsuario'] = request.user.id  # asigna el usuario autenticado
    serializer = TareaSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def obtener_tarea(request, pk):
    try:
        tarea = Tarea.objects.get(pk=pk)
    except Tarea.DoesNotExist:
        return Response({"error": "No existe"}, status=status.HTTP_404_NOT_FOUND)
    serializer = TareaSerializer(tarea)
    return Response(serializer.data)

@api_view(['PUT'])
def actualizar_tarea(request, pk):
    try:
        tarea = Tarea.objects.get(pk=pk)
    except Tarea.DoesNotExist:
        return Response({"error": "No existe"}, status=status.HTTP_404_NOT_FOUND)
    serializer = TareaSerializer(tarea, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def eliminar_tarea(request, pk):
    try:
        tarea = Tarea.objects.get(pk=pk)
    except Tarea.DoesNotExist:
        return Response({"error": "No existe"}, status=status.HTTP_404_NOT_FOUND)
    tarea.delete()
    return Response({"mensaje": "Tarea eliminada"})

