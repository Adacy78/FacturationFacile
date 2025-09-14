import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, Package, X } from 'lucide-react-native';

const ProductCard = ({ product, onPress }: any) => (
  <TouchableOpacity style={styles.productCard} onPress={onPress}>
    <View style={styles.productHeader}>
      <View style={styles.productIcon}>
        <Package size={20} color="#7c3aed" />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>
      <View style={styles.productPricing}>
        <Text style={styles.productPrice}>{product.priceHT} € HT</Text>
        <Text style={styles.productVat}>TVA {product.vatRate}%</Text>
      </View>
    </View>
    <View style={styles.productFooter}>
      <Text style={styles.productCategory}>{product.category}</Text>
      <Text style={styles.productUsage}>{product.usage} fois utilisé</Text>
    </View>
  </TouchableOpacity>
);

const AddProductModal = ({ visible, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    priceHT: '',
    vatRate: '20',
    unit: 'unité',
  });

  const vatRates = [
    { label: '20% (Taux normal)', value: '20' },
    { label: '10% (Taux intermédiaire)', value: '10' },
    { label: '5.5% (Taux réduit)', value: '5.5' },
    { label: '2.1% (Taux super réduit)', value: '2.1' },
    { label: '0% (Exonéré)', value: '0' },
  ];

  const units = ['unité', 'heure', 'jour', 'mois', 'kg', 'm²', 'litre'];

  const handleSave = () => {
    onSave(formData);
    onClose();
    setFormData({
      name: '',
      description: '',
      category: '',
      priceHT: '',
      vatRate: '20',
      unit: 'unité',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Nouveau produit</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informations générales</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom du produit/service *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                placeholder="Ex: Consultation développement web"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
                placeholder="Description détaillée du produit ou service"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Catégorie</Text>
              <TextInput
                style={styles.textInput}
                value={formData.category}
                onChangeText={(text) => setFormData({...formData, category: text})}
                placeholder="Ex: Services, Produits, Formation..."
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Tarification</Text>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Prix unitaire HT *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.priceHT}
                  onChangeText={(text) => setFormData({...formData, priceHT: text})}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Unité</Text>
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerValue}>{formData.unit}</Text>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Taux de TVA</Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerValue}>{formData.vatRate}%</Text>
              </View>
            </View>

            {formData.priceHT && (
              <View style={styles.pricingPreview}>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Prix HT:</Text>
                  <Text style={styles.previewValue}>{formData.priceHT} €</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>TVA ({formData.vatRate}%):</Text>
                  <Text style={styles.previewValue}>
                    {(parseFloat(formData.priceHT || '0') * parseFloat(formData.vatRate) / 100).toFixed(2)} €
                  </Text>
                </View>
                <View style={[styles.previewRow, styles.previewTotal]}>
                  <Text style={styles.previewLabelBold}>Prix TTC:</Text>
                  <Text style={styles.previewValueBold}>
                    {(parseFloat(formData.priceHT || '0') * (1 + parseFloat(formData.vatRate) / 100)).toFixed(2)} €
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default function ProductsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Consultation développement web',
      description: 'Audit technique et conseils en développement web',
      category: 'Services',
      priceHT: 120,
      vatRate: 20,
      unit: 'heure',
      usage: 25,
    },
    {
      id: 2,
      name: 'Formation React Native',
      description: 'Formation complète React Native - 2 jours',
      category: 'Formation',
      priceHT: 1200,
      vatRate: 20,
      unit: 'session',
      usage: 8,
    },
    {
      id: 3,
      name: 'Développement application mobile',
      description: 'Développement sur mesure d\'application mobile',
      category: 'Développement',
      priceHT: 800,
      vatRate: 20,
      unit: 'jour',
      usage: 45,
    },
    {
      id: 4,
      name: 'Maintenance technique',
      description: 'Maintenance préventive et corrective',
      category: 'Services',
      priceHT: 85,
      vatRate: 20,
      unit: 'heure',
      usage: 12,
    },
  ]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = (newProduct: any) => {
    const product = {
      ...newProduct,
      id: products.length + 1,
      priceHT: parseFloat(newProduct.priceHT),
      vatRate: parseFloat(newProduct.vatRate),
      usage: 0,
    };
    setProducts([...products, product]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Produits & Services</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.productsList}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => console.log('Product selected:', product.name)}
            />
          ))}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Package size={48} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Aucun produit trouvé</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Essayez un autre terme de recherche' : 'Commencez par ajouter vos produits et services'}
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <AddProductModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddProduct}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#7c3aed',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  productsList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  productPricing: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 2,
  },
  productVat: {
    fontSize: 12,
    color: '#6b7280',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productCategory: {
    fontSize: 12,
    color: '#7c3aed',
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '500',
  },
  productUsage: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  formSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  pickerValue: {
    fontSize: 16,
    color: '#111827',
  },
  pricingPreview: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  previewTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    marginTop: 4,
    marginBottom: 0,
  },
  previewLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  previewValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  previewLabelBold: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  previewValueBold: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '700',
  },
});