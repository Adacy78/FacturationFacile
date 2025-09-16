import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Switch, Alert, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Building2, CreditCard, Bell, FileText, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, User, Mail, Phone, MapPin, Download, Upload, Globe, X, Camera, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Info, CreditCard as Edit3, Sparkles, Zap, Star } from 'lucide-react-native';
import { useCompany } from '@/hooks/useCompany';
import { useAuth } from '@/hooks/useAuth';
import { useStripe } from '@/hooks/useStripe';
import * as WebBrowser from 'expo-web-browser';
import * as ImagePicker from 'expo-image-picker';

const SettingsSection = ({ title, children }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const SettingsItem = ({ icon: Icon, title, subtitle, onPress, rightElement, iconColor = '#6b7280' }: any) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <View style={styles.itemLeft}>
      <View style={[styles.itemIcon, { backgroundColor: iconColor + '20' }]}>
        <Icon size={20} color={iconColor} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {rightElement || <ChevronRight size={20} color="#9ca3af" />}
  </TouchableOpacity>
);

const CompanyEditModal = ({ visible, onClose, company, onSave }: any) => {
  const [formData, setFormData] = useState({
    name: company?.name || '',
    siren: company?.siren || '',
    vat_number: company?.vat_number || '',
    email: company?.email || '',
    phone: company?.phone || '',
    address: company?.address || '',
    city: company?.city || '',
    postal_code: company?.postal_code || '',
    country: company?.country || 'FR',
    website: company?.website || '',
    business_type: company?.business_type || '',
    legal_form: company?.legal_form || '',
    logo: null,
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, logo: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.siren || !formData.email || !formData.address || !formData.city || !formData.postal_code) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {company ? 'Modifier ma société' : 'Créer ma société'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Logo Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Logo de société</Text>
            <TouchableOpacity style={styles.logoContainer} onPress={pickImage}>
              {formData.logo ? (
                <Image source={{ uri: formData.logo }} style={styles.logoImage} />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Camera size={32} color="#6b7280" />
                  <Text style={styles.logoText}>Ajouter un logo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Informations générales */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informations générales</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom de la société *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                placeholder="Ex: ACME Corporation"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>SIREN *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.siren}
                  onChangeText={(text) => setFormData({...formData, siren: text})}
                  placeholder="123456789"
                  maxLength={9}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>N° TVA</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.vat_number}
                  onChangeText={(text) => setFormData({...formData, vat_number: text})}
                  placeholder="FR12123456789"
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Forme juridique</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.legal_form}
                  onChangeText={(text) => setFormData({...formData, legal_form: text})}
                  placeholder="SARL, SAS, EURL..."
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Secteur d'activité</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.business_type}
                  onChangeText={(text) => setFormData({...formData, business_type: text})}
                  placeholder="Services, Commerce..."
                />
              </View>
            </View>
          </View>

          {/* Contact */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Contact</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                placeholder="contact@acme.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Téléphone</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({...formData, phone: text})}
                  placeholder="+33 1 23 45 67 89"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Site web</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.website}
                  onChangeText={(text) => setFormData({...formData, website: text})}
                  placeholder="www.acme.com"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          {/* Adresse */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Adresse</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Adresse *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.address}
                onChangeText={(text) => setFormData({...formData, address: text})}
                placeholder="123 Rue de la Paix"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ville *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.city}
                  onChangeText={(text) => setFormData({...formData, city: text})}
                  placeholder="Paris"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Code postal *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.postal_code}
                  onChangeText={(text) => setFormData({...formData, postal_code: text})}
                  placeholder="75001"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const StripeConnectModal = ({ visible, onClose, company, onCreateAccount }: any) => {
  const isCompanyComplete = company && 
    company.name && 
    company.siren && 
    company.email && 
    company.address && 
    company.city && 
    company.postal_code;

  const requirements = [
    { label: 'Nom de société', completed: !!company?.name },
    { label: 'SIREN', completed: !!company?.siren },
    { label: 'Email', completed: !!company?.email },
    { label: 'Adresse complète', completed: !!(company?.address && company?.city && company?.postal_code) },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.stripeModalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header avec animation */}
            <View style={styles.stripeHeader}>
              <View style={styles.stripeIconContainer}>
                <Sparkles size={32} color="#635bff" />
              </View>
              <Text style={styles.stripeTitle}>Stripe Connect</Text>
              <Text style={styles.stripeSubtitle}>
                Acceptez les paiements en ligne de vos clients
              </Text>
            </View>

            {/* Card d'information */}
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Info size={20} color="#2563eb" />
                <Text style={styles.infoTitle}>Avant de commencer</Text>
              </View>
              <Text style={styles.infoText}>
                Assurez-vous que les informations de votre société sont complètes et exactes. 
                Elles seront utilisées pour créer votre compte Stripe.
              </Text>
            </View>

            {/* Vérification des prérequis */}
            <View style={styles.requirementsCard}>
              <Text style={styles.requirementsTitle}>Informations requises</Text>
              {requirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  {req.completed ? (
                    <CheckCircle size={20} color="#059669" />
                  ) : (
                    <AlertCircle size={20} color="#dc2626" />
                  )}
                  <Text style={[
                    styles.requirementText,
                    { color: req.completed ? '#059669' : '#dc2626' }
                  ]}>
                    {req.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Avertissement si incomplet */}
            {!isCompanyComplete && (
              <View style={styles.warningCard}>
                <AlertCircle size={20} color="#f59e0b" />
                <View style={styles.warningContent}>
                  <Text style={styles.warningTitle}>Informations incomplètes</Text>
                  <Text style={styles.warningText}>
                    Veuillez compléter les informations de votre société avant de créer un compte Stripe.
                  </Text>
                </View>
              </View>
            )}

            {/* Avantages Stripe */}
            <View style={styles.benefitsCard}>
              <View style={styles.benefitsHeader}>
                <Star size={20} color="#059669" />
                <Text style={styles.benefitsTitle}>Avantages Stripe</Text>
              </View>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Zap size={16} color="#059669" />
                  <Text style={styles.benefitText}>Paiements instantanés</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Shield size={16} color="#059669" />
                  <Text style={styles.benefitText}>Sécurité maximale</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Globe size={16} color="#059669" />
                  <Text style={styles.benefitText}>Accepter toutes les cartes</Text>
                </View>
                <View style={styles.benefitItem}>
                  <FileText size={16} color="#059669" />
                  <Text style={styles.benefitText}>Facturation automatique</Text>
                </View>
              </View>
            </View>

            {/* Boutons d'action */}
            <View style={styles.stripeActions}>
              <TouchableOpacity
                style={[
                  styles.createAccountButton,
                  !isCompanyComplete && styles.createAccountButtonDisabled
                ]}
                onPress={onCreateAccount}
                disabled={!isCompanyComplete}
              >
                <CreditCard size={20} color="#ffffff" />
                <Text style={styles.createAccountButtonText}>
                  Créer mon compte Stripe
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Plus tard</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const ProfileSection = () => {
  const { company, createCompany, updateCompany } = useCompany();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSaveCompany = async (formData: any) => {
    try {
      if (company) {
        await updateCompany(formData);
      } else {
        await createCompany(formData);
      }
      Alert.alert('Succès', 'Informations sauvegardées avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder les informations');
    }
  };

  if (!company) {
    return (
      <SettingsSection title="Informations société">
        <View style={styles.profileCard}>
          <View style={styles.noCompanyContainer}>
            <Building2 size={48} color="#d1d5db" />
            <Text style={styles.noCompanyTitle}>Aucune société configurée</Text>
            <Text style={styles.noCompanyText}>
              Créez votre profil société pour commencer à utiliser toutes les fonctionnalités.
            </Text>
            <TouchableOpacity 
              style={styles.createCompanyButton}
              onPress={() => setShowEditModal(true)}
            >
              <User size={16} color="#ffffff" />
              <Text style={styles.createCompanyButtonText}>Créer ma société</Text>
            </TouchableOpacity>
          </View>
        </View>

        <CompanyEditModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          company={null}
          onSave={handleSaveCompany}
        />
      </SettingsSection>
    );
  }

  return (
    <SettingsSection title="Informations société">
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.companyIcon}>
            <Building2 size={24} color="#2563eb" />
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.companySiren}>SIREN: {company.siren}</Text>
          </View>
          <TouchableOpacity 
            style={styles.editIconButton}
            onPress={() => setShowEditModal(true)}
          >
            <Edit3 size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileDetails}>
          <View style={styles.detailItem}>
            <Mail size={16} color="#6b7280" />
            <Text style={styles.detailText}>{company.email}</Text>
          </View>
          {company.phone && (
            <View style={styles.detailItem}>
              <Phone size={16} color="#6b7280" />
              <Text style={styles.detailText}>{company.phone}</Text>
            </View>
          )}
          {company.address && (
            <View style={styles.detailItem}>
              <MapPin size={16} color="#6b7280" />
              <Text style={styles.detailText}>
                {`${company.address}, ${company.city} ${company.postal_code}`}
              </Text>
            </View>
          )}
          {company.website && (
            <View style={styles.detailItem}>
              <Globe size={16} color="#6b7280" />
              <Text style={styles.detailText}>{company.website}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setShowEditModal(true)}
        >
          <Edit3 size={16} color="#2563eb" />
          <Text style={styles.editButtonText}>Modifier les informations</Text>
        </TouchableOpacity>
      </View>

      <CompanyEditModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        company={company}
        onSave={handleSaveCompany}
      />
    </SettingsSection>
  );
};

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    invoicePaid: true,
    paymentReminder: true,
    overdueInvoice: true,
    newClient: false,
    monthlyReport: true,
  });

  const handleToggle = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SettingsSection title="Notifications">
      <SettingsItem
        icon={Bell}
        title="Facture payée"
        subtitle="Recevoir une notification quand une facture est payée"
        rightElement={
          <Switch
            value={notifications.invoicePaid}
            onValueChange={() => handleToggle('invoicePaid')}
            trackColor={{ false: '#d1d5db', true: '#2563eb' }}
            thumbColor="#ffffff"
          />
        }
        iconColor="#059669"
      />
      <SettingsItem
        icon={Bell}
        title="Relances de paiement"
        subtitle="Notifications pour les relances automatiques"
        rightElement={
          <Switch
            value={notifications.paymentReminder}
            onValueChange={() => handleToggle('paymentReminder')}
            trackColor={{ false: '#d1d5db', true: '#2563eb' }}
            thumbColor="#ffffff"
          />
        }
        iconColor="#f59e0b"
      />
      <SettingsItem
        icon={Bell}
        title="Factures en retard"
        subtitle="Alertes pour les factures impayées"
        rightElement={
          <Switch
            value={notifications.overdueInvoice}
            onValueChange={() => handleToggle('overdueInvoice')}
            trackColor={{ false: '#d1d5db', true: '#2563eb' }}
            thumbColor="#ffffff"
          />
        }
        iconColor="#dc2626"
      />
    </SettingsSection>
  );
};

export default function SettingsScreen() {
  const { signOut, user, userProfile } = useAuth();
  const { company } = useCompany();
  const { loading: stripeLoading, createStripeAccount, createAccountLink, getAccountStatus } = useStripe();
  const [showStripeModal, setShowStripeModal] = useState(false);

  const handleStripeConnect = async () => {
    if (!company) {
      Alert.alert('Erreur', 'Aucune société trouvée. Veuillez d\'abord configurer votre société.');
      return;
    }

    if (company.is_stripe_connected && company.stripe_account_id) {
      // Compte déjà connecté, vérifier le statut
      try {
        const accountStatus = await getAccountStatus(company.stripe_account_id);
        
        if (accountStatus.charges_enabled && accountStatus.payouts_enabled) {
          Alert.alert(
            'Stripe Connect',
            'Votre compte Stripe est connecté et opérationnel.\n\n' +
            `• Paiements: ${accountStatus.charges_enabled ? 'Activés' : 'Désactivés'}\n` +
            `• Virements: ${accountStatus.payouts_enabled ? 'Activés' : 'Désactivés'}`
          );
        } else {
          Alert.alert(
            'Configuration incomplète',
            'Votre compte Stripe nécessite une configuration supplémentaire.',
            [
              { text: 'Annuler', style: 'cancel' },
              { 
                text: 'Continuer la configuration', 
                onPress: () => continueStripeOnboarding(company.stripe_account_id!)
              }
            ]
          );
        }
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de vérifier le statut du compte Stripe');
      }
    } else if (company.stripe_account_id && !company.is_stripe_connected) {
      // Compte créé mais pas encore configuré
      Alert.alert(
        'Configuration Stripe',
        'Votre compte Stripe a été créé mais n\'est pas encore configuré. Voulez-vous continuer la configuration ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Continuer', 
            onPress: () => continueStripeOnboarding(company.stripe_account_id!)
          }
        ]
      );
    } else {
      // Nouveau compte à créer - Afficher la modal stylée
      setShowStripeModal(true);
    }
  };

  const handleCreateStripeAccount = async () => {
    setShowStripeModal(false);
    
    try {
      const result = await createStripeAccount();
      
      Alert.alert(
        'Compte créé',
        'Votre compte Stripe a été créé avec succès. Vous allez maintenant être redirigé pour terminer la configuration.',
        [
          { text: 'OK', onPress: () => continueStripeOnboarding(result.accountId) }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : 'Impossible de créer le compte Stripe'
      );
    }
  };

  const continueStripeOnboarding = async (accountId: string) => {
    try {
      const result = await createAccountLink(
        accountId,
        'https://your-app.com/stripe/success',
        'https://your-app.com/stripe/refresh'
      );
      
      await WebBrowser.openBrowserAsync(result.url);
      
      Alert.alert(
        'Configuration en cours',
        'Une fois la configuration terminée sur Stripe, revenez dans l\'application pour vérifier le statut.'
      );
    } catch (error) {
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : 'Impossible d\'ouvrir la configuration Stripe'
      );
    }
  };

  const handleExportData = () => {
    Alert.alert(
      'Export des données',
      'Exporter toutes vos données (factures, clients, produits) au format CSV ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Exporter', onPress: () => console.log('Export data') }
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import des données',
      'Importer des données depuis un fichier CSV ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Importer', onPress: () => console.log('Import data') }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnecter', 
          style: 'destructive', 
          onPress: async () => {
            try {
              const { error } = await signOut();
              if (error) {
                Alert.alert('Erreur', 'Impossible de se déconnecter');
              } else {
                router.replace('/auth');
              }
            } catch (error) {
              Alert.alert('Erreur', 'Une erreur inattendue s\'est produite');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileSection />

        <SettingsSection title="Compte utilisateur">
          <View style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userIcon}>
                <User size={20} color="#2563eb" />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <Text style={styles.userDate}>
                  Membre depuis {userProfile?.created_at ? 
                    new Date(userProfile.created_at).toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: 'long' 
                    }) : 'N/A'
                  }
                </Text>
              </View>
            </View>
          </View>
        </SettingsSection>

        <SettingsSection title="Paiements">
          <SettingsItem
            icon={CreditCard}
            title="Stripe Connect"
            subtitle={
              company?.is_stripe_connected 
                ? 'Compte connecté et actif' 
                : company?.stripe_account_id 
                  ? 'Configuration en cours'
                  : 'Configurer les paiements'
            }
            onPress={handleStripeConnect}
            iconColor={
              company?.is_stripe_connected 
                ? '#059669' 
                : company?.stripe_account_id 
                  ? '#f59e0b'
                  : '#6b7280'
            }
            rightElement={stripeLoading ? (
              <View style={styles.loadingSpinner}>
                <Text style={styles.loadingText}>...</Text>
              </View>
            ) : undefined}
          />
        </SettingsSection>

        <NotificationSettings />

        <SettingsSection title="Facturation">
          <SettingsItem
            icon={FileText}
            title="Modèles de factures"
            subtitle="Personnaliser l'apparence de vos factures"
            onPress={() => console.log('Invoice templates')}
            iconColor="#7c3aed"
          />
          <SettingsItem
            icon={FileText}
            title="Numérotation"
            subtitle="Format: FACT-2025-001"
            onPress={() => console.log('Invoice numbering')}
            iconColor="#2563eb"
          />
        </SettingsSection>

        <SettingsSection title="Données">
          <SettingsItem
            icon={Download}
            title="Exporter les données"
            subtitle="Télécharger toutes vos données au format CSV"
            onPress={handleExportData}
            iconColor="#059669"
          />
          <SettingsItem
            icon={Upload}
            title="Importer des données"
            subtitle="Importer clients et produits depuis CSV"
            onPress={handleImportData}
            iconColor="#2563eb"
          />
        </SettingsSection>

        <SettingsSection title="Sécurité & Conformité">
          <SettingsItem
            icon={Shield}
            title="Données personnelles (RGPD)"
            subtitle="Gestion de vos données et confidentialité"
            onPress={() => console.log('GDPR settings')}
            iconColor="#059669"
          />
          <SettingsItem
            icon={FileText}
            title="Archivage légal"
            subtitle="Conservation 10 ans - 1.2 GB utilisés"
            onPress={() => console.log('Legal archiving')}
            iconColor="#7c3aed"
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsItem
            icon={HelpCircle}
            title="Centre d'aide"
            subtitle="FAQ et guides d'utilisation"
            onPress={() => console.log('Help center')}
            iconColor="#2563eb"
          />
          <SettingsItem
            icon={Mail}
            title="Contacter le support"
            subtitle="support@facturation-app.fr"
            onPress={() => console.log('Contact support')}
            iconColor="#059669"
          />
        </SettingsSection>

        <SettingsSection title="Compte">
          <SettingsItem
            icon={LogOut}
            title="Se déconnecter"
            subtitle="Déconnexion de l'application"
            onPress={handleLogout}
            iconColor="#dc2626"
          />
        </SettingsSection>

        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.buildInfo}>Build 2025.01.18</Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <StripeConnectModal
        visible={showStripeModal}
        onClose={() => setShowStripeModal(false)}
        company={company}
        onCreateAccount={handleCreateStripeAccount}
      />
    </SafeAreaView>
  );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  companySiren: {
    fontSize: 13,
    color: '#6b7280',
  },
  editIconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
  },
  profileDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  noCompanyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noCompanyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  noCompanyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  createCompanyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createCompanyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  userDate: {
    fontSize: 13,
    color: '#6b7280',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  appVersion: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  buildInfo: {
    fontSize: 12,
    color: '#9ca3af',
  },
  loadingSpinner: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 32,
  },
  // Modal styles
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
    backgroundColor: '#2563eb',
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  logoText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  // Stripe Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  stripeModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  stripeHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stripeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stripeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  stripeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  requirementsCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  warningCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
  benefitsCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46',
    marginLeft: 8,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 14,
    color: '#065f46',
    marginLeft: 8,
    fontWeight: '500',
  },
  stripeActions: {
    gap: 12,
  },
  createAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#635bff',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#635bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createAccountButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },
  createAccountButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
});
}