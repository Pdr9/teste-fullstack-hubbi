from django.test import TestCase
from django.contrib.auth.models import User
from decimal import Decimal
from products.models import Product
from sales.models import Sale, SaleItem


class SaleModelTest(TestCase):
    """Testes para os modelos Sale e SaleItem."""
    
    def setUp(self):
        """Configuração inicial para os testes."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.product1 = Product.objects.create(
            name='Produto 1',
            price=Decimal('10.00'),
            user=self.user
        )
        
        self.product2 = Product.objects.create(
            name='Produto 2',
            price=Decimal('20.00'),
            user=self.user
        )
    
    def test_create_sale(self):
        """Testa criação básica de venda."""
        sale = Sale.objects.create(
            user=self.user
        )
        
        self.assertEqual(sale.user, self.user)
        self.assertEqual(sale.total_items, 0)
        self.assertEqual(sale.total_value, Decimal('0.00'))
    
    def test_sale_with_items(self):
        """Testa venda com itens e cálculos automáticos."""
        sale = Sale.objects.create(
            user=self.user
        )
        
        # Adicionar itens
        SaleItem.objects.create(
            sale=sale,
            product=self.product1,
            quantity=2
        )
        
        SaleItem.objects.create(
            sale=sale,
            product=self.product2,
            quantity=1
        )
        
        # Verificar cálculos
        expected_total_items = 3
        expected_total_value = Decimal('40.00')  # (2 * 10) + (1 * 20)
        
        self.assertEqual(sale.total_items, expected_total_items)
        self.assertEqual(sale.total_value, expected_total_value)
    
    def test_sale_str_representation(self):
        """Testa representação string da venda."""
        sale = Sale.objects.create(
            user=self.user
        )
        
        expected = f"Venda #{sale.id} - {self.user.username}"
        self.assertEqual(str(sale), expected)
    
    def test_sale_item_str_representation(self):
        """Testa representação string do item de venda."""
        sale = Sale.objects.create(
            user=self.user
        )
        
        item = SaleItem.objects.create(
            sale=sale,
            product=self.product1,
            quantity=3
        )
        
        expected = "Produto 1 - Qtd: 3"
        self.assertEqual(str(item), expected)
    
    def test_sale_item_subtotal_calculation(self):
        """Testa cálculo de subtotal do item."""
        sale = Sale.objects.create(
            user=self.user
        )
        
        item = SaleItem.objects.create(
            sale=sale,
            product=self.product1,
            quantity=5
        )
        
        expected_subtotal = Decimal('50.00')  # 5 * 10.00
        self.assertEqual(item.subtotal, expected_subtotal)