from django.db import models

from django.db import models

class Tarea(models.Model):
    Id = models.AutoField(primary_key=True)
    Titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    FechaVence = models.DateField()
    Estado = models.BooleanField(default=False)  # tinyint(1) → booleano

    class Meta:
        db_table = 'tarea'  # nombre exacto de la tabla en MySQL

    def __str__(self):
        return self.Titulo
