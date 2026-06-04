export const mockQuotations = [
  {
    id: '1',
    quotationRefNo: 'AEM/24-25/0003',
    status: 'finalized',
    createdAt: '2024-10-27T09:15:00Z',
    customerDetails: { customerName: 'Larsen & Toubro', companyName: 'L&T Construction' },
    jobDetails: { equipmentType: 'Crane', requiredDate: '2024-11-10' },
    pricingBreakdown: { grandTotal: 45000 }
  },
  {
    id: '2',
    quotationRefNo: 'AEM/24-25/0002',
    status: 'draft',
    createdAt: '2024-10-26T14:30:00Z',
    customerDetails: { customerName: 'Suresh Menon', companyName: '' },
    jobDetails: { equipmentType: 'Tipper', requiredDate: '2024-10-28' },
    pricingBreakdown: { grandTotal: 8500 }
  },
  {
    id: '3',
    quotationRefNo: 'AEM/24-25/0001',
    status: 'finalized',
    createdAt: '2024-10-25T10:00:00Z',
    customerDetails: { customerName: 'Ramesh Kumar', companyName: 'BuildTech' },
    jobDetails: { equipmentType: 'JCB 3DX', requiredDate: '2024-11-01' },
    pricingBreakdown: { grandTotal: 14160 }
  }
];
