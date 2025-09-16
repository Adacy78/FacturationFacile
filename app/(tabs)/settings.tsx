import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Switch, Alert, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Building2, CreditCard, Bell, FileText, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, User, Mail, Phone, MapPin, Download, Upload, Globe, X, Camera, AlertCircle, CheckCircle, Info } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useCompany } from '@/hooks/useCompany';
import { useStripe } from '@/hooks/useStripe';
import * as WebBrowser from 'expo-web-browser';

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

const StripeConnectModal = ({ visible, onClose, onProceed, company }: any) => {
  const isCompanyComplete = company && company.name && company.siren && company.email && 
                           company.address && company.city && company.postal_code;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Stripe Connect</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Info size={24} color="#2563eb" />
              <Text style={styles.infoTitle}>Avant de commencer</Text>
            </View>
            <Text style={styles.infoText}>
              Pour créer votre compte Stripe Connect et accepter les paiements, 
              vos informations de société doivent être complètes et exactes.
            </Text>
          </View>

          <View style={styles.requirementsCard}>
            <Text style={styles.requirementsTitle}>Informations requises :</Text>
            
            <View style={styles.requirementsList}>
              <View style={styles.requirementItem}>
                {company?.name ? (
                  <CheckCircle size={16} color="#059669" />
                ) : (
                  <AlertCircle size={16} color="#dc2626" />
                )}
                <Text style={[styles.requirementText, !company?.name && styles.requirementMissing]}>
                  Nom de la société
                </Text>
              </View>

              <View style={styles.requirementItem}>
                {company?.siren ? (
                  <CheckCircle size={16} color="#059669" />
                ) : (
                  <AlertCircle size={16} color="#dc2626" />
                )}
                <Text style={[styles.requirementText, !company?.siren && styles.requirementMissing]}>
                  Numéro SIREN (9 chiffres)
                </Text>
              </View>

              <View style={styles.requirementItem}>
                {company?.email ? (
                  <CheckCircle size={16} color="#059669" />
                ) : (
                  <AlertCircle size={16} color="#dc2626" />
                )}
                <Text style={[styles.requirementText, !company?.email && styles.requirementMissing]}>
                  Email de contact
                </Text>
              </View>

              <View style={styles.requirementItem}>
                {company?.address && company?.city && company?.postal_code ? (
                  <CheckCircle size={16} color="#059669" />
                ) : (
                  <AlertCircle size={16} color="#dc2626" />
                )}
                <Text style={[styles.requirementText, (!company?.address || !company?.city || !company?.postal_code) && styles.requirementMissing]}>
                  Adresse complète
                </Text>
              </View>
            </View>
          </View>

          {!isCompanyComplete && (
            <View style={styles.warningCard}>
              <AlertCircle size={20} color="#f59e0b" />
              <Text style={styles.warningText}>
                Certaines informations sont manquantes. Veuillez compléter votre profil société avant de continuer.
              </Text>
            </View>
          )}

          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>Avec Stripe Connect, vous pourrez :</Text>
            <View style={styles.benefitsList}>
              <Text style={styles.benefitItem}>• Accepter les paiements par carte</Text>
              <Text style={styles.benefitItem}>• Recevoir les virements automatiquement</Text>
              <Text style={styles.benefitItem}>• Suivre vos transactions en temps réel</Text>
              <Text style={styles.benefitItem}>• Gérer les remboursements facilement</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={[styles.proceedButton, !isCompanyComplete && styles.proceedButtonDisabled]}
            onPress={isCompanyComplete ? onProceed : undefined}
            disabled={!isCompanyComplete}
          >
            <Text style={[styles.proceedButtonText, !isCompanyComplete && styles.proceedButtonTextDisabled]}>
              {isCompanyComplete ? 'Créer le compte Stripe' : 'Compléter les informations'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const EditCompanyModal = ({ visible, onClose, onSave, company }: any) => {
  const [formData, setFormData] = useState({
    name: company?.name || '',
    siren: company?.siren || '',
    vatNumber: company?.vat_number || '',
    email: company?.email || '',
    phone: company?.phone || '',
    address: company?.address || '',
    city: company?.city || '',
    postalCode: company?.postal_code || '',
    country: company?.country || 'FR',
    website: company?.website || '',
    businessType: company?.business_type || '',
    legalForm: company?.legal_form || '',
  });

  const [logoUri, setLogoUri] = useState<string | null>(null);

  const handleSave = () => {
    if (!formData.name || !formData.siren || !formData.email || !formData.address || !formData.city || !formData.postalCode) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    onSave({
      name: formData.name,
      siren: formData.siren,
      vat_number: formData.vatNumber,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postal_code: formData.postalCode,
      country: formData.country,
      website: formData.website,
      business_type: formData.businessType,
      legal_form: formData.legalForm,
    });
  };

  const handleSelectLogo = () => {
    Alert.alert(
      'Logo de société',
      'Sélectionner une source pour votre logo',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Galerie', onPress: () => console.log('Select from gallery') },
        { text: 'Appareil photo', onPress: () => console.log('Take photo') },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Modifier la société</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Logo de société</Text>
            <TouchableOpacity style={styles.logoContainer} onPress={handleSelectLogo}>
              {logoUri ? (
                <Image source={{ uri: logoUri }} style={styles.logoImage} />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Camera size={32} color="#6b7280" />
                  <Text style={styles.logoPlaceholderText}>Ajouter un logo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

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

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SIREN *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.siren}
                onChangeText={(text) => setFormData({...formData, siren: text})}
                placeholder="123 456 789"
                maxLength={11}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>N° TVA intracommunautaire</Text>
              <TextInput
                style={styles.textInput}
                value={formData.vatNumber}
                onChangeText={(text) => setFormData({...formData, vatNumber: text})}
                placeholder="FR 12 123456789"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Forme juridique</Text>
              <TextInput
                style={styles.textInput}
                value={formData.legalForm}
                onChangeText={(text) => setFormData({...formData, legalForm: text})}
                placeholder="SARL, SAS, EURL..."
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Secteur d'activité</Text>
              <TextInput
                style={styles.textInput}
                value={formData.businessType}
                onChangeText={(text) => setFormData({...formData, businessType: text})}
                placeholder="Services informatiques, Commerce..."
              />
            </View>
          </View>

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
                placeholder="https://www.acme.com"
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </View>

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
                  value={formData.postalCode}
                  onChangeText={(text) => setFormData({...formData, postalCode: text})}
                  placeholder="75001"
                  maxLength={5}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pays</Text>
              <TextInput
                style={styles.textInput}
                value={formData.country}
                onChangeText={(text) => setFormData({...formData, country: text})}
                placeholder="FR"
                maxLength={2}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const ProfileSection = () => {
  const { company, updateCompany } = useCompany();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleUpdateCompany = async (updatedData: any) => {
    try {
      const { error } = await updateCompany(updatedData);
      if (error) {
        Alert.alert('Erreur', 'Impossible de mettre à jour la société');
      } else {
        Alert.alert('Succès', 'Informations mises à jour avec succès');
        setShowEditModal(false);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur inattendue s\'est produite');
    }
  };

  if (!company) {
    return (
      <SettingsSection title="Informations société">
        <View style={styles.profileCard}>
          <Text style={styles.noCompanyText}>
            Aucune société configurée. Veuillez créer votre profil société.
          </Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
          >
            <User size={16} color="#2563eb" />
            <Text style={styles.editButtonText}>Créer ma société</Text>
          </TouchableOpacity>
        </View>
        
        <EditCompanyModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateCompany}
          company={company}
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
          <User size={16} color="#2563eb" />
          <Text style={styles.editButtonText}>Modifier les informations</Text>
        </TouchableOpacity>
      </View>
      
      <EditCompanyModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleUpdateCompany}
        company={company}
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
  const { loading: stripeLoading, createStripeAccount, createAccountLink, getAccountStatus, updateStripeConnectionStatus } = useStripe();
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
      continueStripeOnboarding(company.stripe_account_id!);
    } else {
      // Nouveau compte à créer
      setShowStripeModal(true);
    }
  };

  const createNewStripeAccount = async () => {
    setShowStripeModal(false);
    try {
      const result = await createStripeAccount();
      
      // Rediriger directement vers l'onboarding
      continueStripeOnboarding(result.accountId);
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
        'https://your-app.com/stripe/success', // URL de retour après succès
        'https://your-app.com/stripe/refresh'  // URL de rafraîchissement
      );
      
      // Ouvrir le lien d'onboarding dans le navigateur
      await WebBrowser.openBrowserAsync(result.url);
      
      // Optionnel: Vérifier le statut après que l'utilisateur revienne
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
        onProceed={createNewStripeAccount}
        company={company}
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
  noCompanyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
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
  placeholder: {
    width: 32,
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
  infoCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  requirementsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontSize: 14,
    color: '#374151',
  },
  requirementMissing: {
    color: '#dc2626',
  },
  warningCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  warningText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
    flex: 1,
  },
  benefitsCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 12,
  },
  benefitsList: {
    gap: 6,
  },
  benefitItem: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  proceedButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  proceedButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  proceedButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  proceedButtonTextDisabled: {
    color: '#9ca3af',
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
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoPlaceholderText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});