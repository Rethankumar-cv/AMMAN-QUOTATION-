import { challanStore } from './db';

const repairChallanSchema = (data) => {
  if (!data) return null;
  return {
    id: data.id || crypto.randomUUID(),
    dcNo: data.dcNo || '',
    date: data.date || new Date().toISOString().split('T')[0],
    eWayBillNo: data.eWayBillNo || '',
    transporterName: data.transporterName || '',
    time: data.time || '',
    vehicleNo: data.vehicleNo || '',
    reason: data.reason || 'Hiring',
    transactionType: data.transactionType || 'Bill From - Dispatch From',
    billFrom: data.billFrom || { name: '', gst: '', address: '', state: '' },
    billTo: data.billTo || { name: '', gst: '', address: '', state: '' },
    dispatchFrom: data.dispatchFrom || { address1: '', address2: '', cityStatePin: '' },
    shipTo: data.shipTo || { address1: '', address2: '', cityStatePin: '' },
    items: data.items || [{ id: crypto.randomUUID(), sno: 1, description: '', hsn: '', qty: 1, rate: 0, total: 0 }],
    pricing: data.pricing || { subtotal: 0, cgst: 0, sgst: 0, roundOff: 0, grandTotal: 0 },
    notes: data.notes || "1. Movement of goods only; not a tax invoice.\n2. GST / e-way bill details to be filled as applicable.\n3. Driver / fuel / transport charges are separate if applicable.",
    authorizedSignatory: data.authorizedSignatory || 'Authorized Signatory',
    receiverSignature: data.receiverSignature || '',
    status: data.status || 'draft',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString()
  };
};

export const saveChallan = async (challan) => {
  try {
    challan.updatedAt = new Date().toISOString();
    await challanStore.setItem(challan.id, challan);
    return challan;
  } catch (error) {
    console.error('Error saving challan:', error);
    throw error;
  }
};

export const getChallanById = async (id) => {
  try {
    const data = await challanStore.getItem(id);
    return repairChallanSchema(data);
  } catch (error) {
    console.error('Error fetching challan:', error);
    throw error;
  }
};

export const getAllChallans = async (statusFilter = null) => {
  try {
    const challans = [];
    await challanStore.iterate((value) => {
      if (!statusFilter || value.status === statusFilter) {
        challans.push(repairChallanSchema(value));
      }
    });
    return challans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error fetching all challans:', error);
    throw error;
  }
};

export const searchChallans = async (query) => {
  try {
    const lowerQuery = query.toLowerCase();
    const challans = [];
    await challanStore.iterate((value) => {
      const matchName = value.billTo?.name?.toLowerCase().includes(lowerQuery);
      const matchRef = value.dcNo?.toLowerCase().includes(lowerQuery);
      if (matchName || matchRef) challans.push(repairChallanSchema(value));
    });
    return challans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error searching challans:', error);
    throw error;
  }
};

export const deleteChallan = async (id) => {
  try {
    await challanStore.removeItem(id);
    return true;
  } catch (error) {
    console.error('Error deleting challan:', error);
    throw error;
  }
};

export const updateChallanStatus = async (id, newStatus) => {
  try {
    const data = await challanStore.getItem(id);
    if (!data) throw new Error('Challan not found');
    data.status = newStatus;
    data.updatedAt = new Date().toISOString();
    await challanStore.setItem(id, data);
    return data;
  } catch (error) {
    console.error('Error updating challan status:', error);
    throw error;
  }
};

export const duplicateChallan = async (challan) => {
  try {
    const cloned = {
      ...challan,
      id: crypto.randomUUID(),
      dcNo: '',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await challanStore.setItem(cloned.id, cloned);
    return cloned;
  } catch (error) {
    console.error('Error duplicating challan:', error);
    throw error;
  }
};
