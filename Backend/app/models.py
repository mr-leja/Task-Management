from django.db import models
from autenticacion.models import Usuario



class Tarea(models.Model):
    Id = models.AutoField(primary_key=True)
    Titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    FechaVence = models.DateField()
    Estado = models.BooleanField(default=False)  # tinyint(1) → booleano
    IdUsuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='IdUsuario', related_name='tareas')

    class Meta:
        db_table = 'tarea'

    def __str__(self):
        return self.Titulo
