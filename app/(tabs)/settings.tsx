import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Building2, CreditCard, Bell, FileText, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, User, Mail, Phone, MapPin, Download, Upload, Globe, X, Camera, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Info } from 'lucide-react-native';
import { useCompany } from '@/hooks/useCompany';
import { useAuth } from '@/hooks/useAuth';
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

const ProfileSection = () => {
  const { company } = useCompany();

  if (!company) {
    return (
      <SettingsSection title="Informations société">
        <View style={styles.profileCard}>
          <Text style={styles.noCompanyText}>
            Aucune société configurée. Veuillez créer votre profil société.
          </Text>
          <TouchableOpacity style={styles.editButton}>
            <User size={16} color="#2563eb" />
            <Text style={styles.editButtonText}>Créer ma société</Text>
          </TouchableOpacity>
        </View>
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

        <TouchableOpacity style={styles.editButton}>
          <User size={16} color="#2563eb" />
          <Text style={styles.editButtonText}>Modifier les informations</Text>
        </TouchableOpacity>
      </View>
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
      // Nouveau compte à créer
      Alert.alert(
        'Créer un compte Stripe',
        'Vous allez créer un compte Stripe Connect pour accepter les paiements. Cette opération est gratuite.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Créer le compte', onPress: createNewStripeAccount }
        ]
      );
    }
  };

  const createNewStripeAccount = async () => {
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
});