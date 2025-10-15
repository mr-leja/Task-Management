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
        if not self.pk or not self.Contrasena.startswith('pbkdf2_'):
            self.Contrasena = make_password(self.Contrasena)
        super().save(*args, **kwargs)

    def verificar_contrasena(self, contrasena):
        return check_password(contrasena, self.Contrasena)

    def __str__(self):
        return self.Nombre

