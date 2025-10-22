from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class Sale(models.Model):
    """
    Modelo que representa uma venda no sistema.
    
    Uma venda é criada por um usuário em uma data específica.
    Uma venda pode ter múltiplos produtos através do modelo SaleItem.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text="Usuário que criou a venda")
    date = models.DateTimeField(auto_now_add=True, help_text="Data e hora da criação da venda")

    class Meta:
        verbose_name = "Venda"
        verbose_name_plural = "Vendas"
        ordering = ['-date']

    def __str__(self):
        return f"Venda #{self.id} - {self.user.username}"


class SaleItem(models.Model):
    """
    Modelo que representa um item específico dentro de uma venda.
    
    Cada SaleItem conecta uma venda a um produto específico com uma quantidade.
    Uma venda pode ter múltiplos SaleItems (múltiplos produtos).
    """
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items', help_text="Venda à qual este item pertence")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, help_text="Produto sendo vendido")
    quantity = models.PositiveIntegerField(help_text="Quantidade do produto vendida")

    class Meta:
        verbose_name = "Item da Venda"
        verbose_name_plural = "Itens das Vendas"

    def __str__(self):
        return f"{self.product.name} - Qtd: {self.quantity}"
