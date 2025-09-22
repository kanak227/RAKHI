import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../../components/ui/navbar';

const initialUser = {
  firstName: 'Aarav',
  lastName: 'Mehra',
  age: 28,
  gender: 'Male',
  location: 'Mumbai, India',
  profilePic: '', // set to '' for no pic, or provide a URL
  contact: '+91 9000000000',
  email: 'aarav.mehra@email.com',
  occupation: 'Software Engineer',
  organization: 'Tech4Good Foundation',
};

const initialHelplines = [
  { id: '1', name: 'Women Helpline', contact: '1091' },
  { id: '2', name: 'National Commission for Women', contact: '7827-170-170' },
  { id: '3', name: 'NGO: Sakshi', contact: '+91 9876543210' },
];

function getInitial(name: string) {
  return name ? name[0].toUpperCase() : '';
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = React.useState(initialUser);
  const [helplines, setHelplines] = React.useState(initialHelplines);
  const [editModal, setEditModal] = React.useState(false);
  const [editFields, setEditFields] = React.useState(user);
  const [editHelplineModal, setEditHelplineModal] = React.useState(false);
  const [helplineFields, setHelplineFields] = React.useState([...helplines]);

  const handleEdit = () => {
    setEditFields(user);
    setEditModal(true);
  };
  const handleSave = () => {
    setUser(editFields);
    setEditModal(false);
  };

  const handleEditHelplines = () => {
    setHelplineFields([...helplines]);
    setEditHelplineModal(true);
  };
  const handleSaveHelplines = () => {
    setHelplines([...helplineFields]);
    setEditHelplineModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Navbar */}
      <Navbar onLogout={() => router.replace('/')} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          {user.profilePic ? (
            <Image source={{ uri: user.profilePic }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{getInitial(user.firstName)}</Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
              <Text style={styles.profileName}>{user.firstName} {user.lastName}</Text>
              <TouchableOpacity onPress={handleEdit} style={styles.editBtn}>
                <Ionicons name="pencil" size={20} color="#e75480" />
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.profileDetails}>Age: {user.age}</Text>
            <Text style={styles.profileDetails}>Gender: {user.gender}</Text>
            <Text style={styles.profileDetails}>Location: {user.location}</Text>
            <Text style={styles.profileDetails}>Contact: {user.contact}</Text>
            <Text style={styles.profileDetails}>Email: {user.email}</Text>
          </View>
        </View>
        {/* Other Details Section */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Other Details</Text>
          </View>
          <View style={{ marginTop: 4, marginBottom: 2 }}>
            <Text style={styles.profileDetails}>Occupation: {user.occupation}</Text>
            <Text style={styles.profileDetails}>Organization: {user.organization}</Text>
          </View>
        </View>

        {/* Helpline Contacts Section */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Helpline Contacts</Text>
            <TouchableOpacity onPress={handleEditHelplines} style={styles.editBtn}>
              <Ionicons name="pencil" size={18} color="#e75480" />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 4, marginBottom: 2 }}>
            {helplines.map((h, idx) => (
              <View key={h.id} style={{ marginBottom: 6 }}>
                <Text style={styles.profileDetails}>{h.name}: {h.contact}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      {/* Edit Helplines Modal */}
      <Modal visible={editHelplineModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Helpline Contacts</Text>
            {helplineFields.map((h, idx) => (
              <View key={h.id} style={{ marginBottom: 10 }}>
                <TextInput
                  style={styles.input}
                  value={helplineFields[idx].name}
                  onChangeText={t => setHelplineFields(f => { const arr = [...f]; arr[idx] = { ...arr[idx], name: t }; return arr; })}
                  placeholder="Helpline Name"
                />
                <TextInput
                  style={styles.input}
                  value={helplineFields[idx].contact}
                  onChangeText={t => setHelplineFields(f => { const arr = [...f]; arr[idx] = { ...arr[idx], contact: t }; return arr; })}
                  placeholder="Contact Number"
                />
              </View>
            ))}
            <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop:16}}>
              <TouchableOpacity onPress={()=>setEditHelplineModal(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveHelplines} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Edit Modal */}
      <Modal visible={editModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Details</Text>
            <TextInput style={styles.input} value={editFields.firstName} onChangeText={t=>setEditFields(f=>({...f,firstName:t}))} placeholder="First Name" />
            <TextInput style={styles.input} value={editFields.lastName} onChangeText={t=>setEditFields(f=>({...f,lastName:t}))} placeholder="Last Name" />
            <TextInput style={styles.input} value={String(editFields.age)} onChangeText={t=>setEditFields(f=>({...f,age:Number(t)}))} placeholder="Age" keyboardType="numeric" />
            <TextInput style={styles.input} value={editFields.gender} onChangeText={t=>setEditFields(f=>({...f,gender:t}))} placeholder="Gender" />
            <TextInput style={styles.input} value={editFields.location} onChangeText={t=>setEditFields(f=>({...f,location:t}))} placeholder="Location" />
            <TextInput style={styles.input} value={editFields.contact} onChangeText={t=>setEditFields(f=>({...f,contact:t}))} placeholder="Contact Number" keyboardType="phone-pad" />
            <TextInput style={styles.input} value={editFields.email} onChangeText={t=>setEditFields(f=>({...f,email:t}))} placeholder="Email" keyboardType="email-address" />
            <TextInput style={styles.input} value={editFields.occupation} onChangeText={t=>setEditFields(f=>({...f,occupation:t}))} placeholder="Occupation" />
            <TextInput style={styles.input} value={editFields.organization} onChangeText={t=>setEditFields(f=>({...f,organization:t}))} placeholder="Organization" />
            <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop:16}}>
              <TouchableOpacity onPress={()=>setEditModal(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff0f5',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ffe4ec',
    elevation: 2,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e75480',
    letterSpacing: 4,
    fontFamily: 'serif',
  },
  logoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#ffe4ec',
    borderRadius: 16,
  },
  logoutText: {
    color: '#e75480',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 24,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 20,
    backgroundColor: '#ffe4ec',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 20,
    backgroundColor: '#ffe4ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 28,
    color: '#e75480',
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e75480',
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 24,
    marginTop: 18,
    padding: 18,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  infoText: {
    color: '#444',
    fontSize: 14,
    marginBottom: 2,
    lineHeight: 20,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe4ec',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 12,
  },
  editBtnText: {
    color: '#e75480',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e75480',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffe4ec',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
    backgroundColor: '#fff0f5',
  },
  cancelBtn: {
    backgroundColor: '#ffe4ec',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 10,
  },
  cancelBtnText: {
    color: '#e75480',
    fontWeight: 'bold',
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: '#e75480',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e75480',
    letterSpacing: 1,
  },
});
