from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    """
    Modelo que representa um produto no sistema.
    
    Cada produto tem um nome, preço e é criado por um usuário específico.
    """
    name = models.CharField(max_length=200, help_text="Nome do produto")
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Preço do produto em reais")
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text="Usuário que criou o produto")

    class Meta:
        verbose_name = "Produto"
        verbose_name_plural = "Produtos"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - R$ {self.price}"
