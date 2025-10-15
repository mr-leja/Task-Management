from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class Usuario(models.Model):
    Id = models.AutoField(primary_key=True)
    Nombre = models.CharField(max_length=100)
    Apellidos = models.CharField(max_length=100)
    Correo = models.EmailField(unique=True)
    Contrasena = models.CharField(max_length=255)

    class Meta:
        db_table = 'usuario'

    def save(self, *args, **kwargs):
        # Encripta la contraseña antes de guardar
        if not self.pk or not check_password(self.Contrasena, self.Contrasena):
            self.Contrasena = make_password(self.Contrasena)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.Nombre} {self.Apellidos}"