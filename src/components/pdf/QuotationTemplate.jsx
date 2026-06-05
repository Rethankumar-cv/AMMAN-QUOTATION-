import React from 'react';
import SignatureBlock from './SignatureBlock';

const QuotationTemplate = React.forwardRef(({ data, profile }, ref) => {
  const { formatted, customerDetails = {}, jobDetails = {}, pricingBreakdown = {}, brandingMetadata = {} } = data;

  // Format currency helper to ensure '0' is shown if empty
  const fmt = (val) => val && Number(val) !== 0 ? Number(val).toLocaleString('en-IN') : '0';

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: 'white',
        padding: '40px',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: '1.4',
        width: '794px', // Absolute strict desktop width for perfect mobile rendering
        minHeight: '1123px', // Absolute height for A4 aspect ratio
        boxSizing: 'border-box',
        WebkitTextSizeAdjust: 'none', // CRITICAL: Stop iPhone Safari from enlarging fonts randomly
        textSizeAdjust: 'none',       // CRITICAL: Stop mobile font inflation bugs in canvas
        margin: '0 auto',
        boxShadow: 'none', // Remove shadow for PDF export
        borderRadius: '0'  // Remove border radius for PDF export
      }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
        <div>
          {/* Use the new logo explicitly as requested */}
          <img src="/assets/logo.png" alt="Amman Earth Movers Logo" style={{ height: '80px', objectFit: 'contain', maxWidth: '250px' }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#4A4A4A', margin: '0 0 2px 0' }}>{profile.companyName || 'AMMAN EARTH MOVERS'}</h2>
          <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#F39200', fontWeight: 'bold' }}>{profile.tagline || 'Heavy Earthmoving & Vehicle Solutions'}</p>
          <p style={{ margin: '0 0 2px 0', color: '#666' }}>{profile.address || '60-A, NGR Street, Kalapatti, Coimbatore - 641 048'}</p>
          {profile.email && <p style={{ margin: '0 0 2px 0', color: '#666' }}>E-mail: {profile.email}</p>}
          <p style={{ margin: 0, color: '#666' }}><strong>Contact:</strong> {profile.contact || '9842267585 | 9842867585'}</p>
        </div>
      </div>

      {/* Title Bar */}
      <div style={{ backgroundColor: '#F39200', color: 'white', textAlign: 'center', padding: '6px 0', fontWeight: 'bold', fontSize: '14px', marginBottom: '16px' }}>
        QUOTATION / RENTAL ESTIMATE
      </div>

      {/* Customer / To & Ref Area */}
      <div style={{ display: 'flex', border: '1px solid #CCC', marginBottom: '12px' }}>
        <div style={{ width: '50%', padding: '8px 12px', display: 'flex', alignItems: 'center' }}>
          <div><strong>Customer / To:</strong> {customerDetails.customerName} {customerDetails.companyName ? ` / ${customerDetails.companyName}` : ''}</div>
        </div>
        <div style={{ width: '50%', backgroundColor: '#F5F5F5', padding: '8px 12px', borderLeft: '1px solid #CCC', textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ margin: '0 0 2px 0' }}><strong>Ref No:</strong> {data.quotationRefNo || '[Draft]'}</p>
          <p style={{ margin: 0 }}><strong>Date:</strong> {formatted.displayDate}</p>
        </div>
      </div>

      {/* Customer Details Grid */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px', width: '20%', fontWeight: 'bold' }}>Customer Name</td>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px', width: '30%' }}>{customerDetails.customerName || '-'}</td>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px', width: '20%', fontWeight: 'bold' }}>Vehicle / Equipment</td>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px', width: '30%' }}>{jobDetails.equipmentType || '-'}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px', fontWeight: 'bold' }}>Company Name</td>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px' }}>{customerDetails.companyName || '-'}</td>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px', fontWeight: 'bold' }}>Rental Basis</td>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px' }}>{jobDetails.rentalBasis || '-'}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px', fontWeight: 'bold' }}>Mobile No.</td>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px' }}>{customerDetails.mobileNo || '-'}</td>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px', fontWeight: 'bold' }}>Work Location</td>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px' }}>{jobDetails.workLocation || '-'}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px', fontWeight: 'bold' }}>GST / PAN</td>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px' }}>{customerDetails.gstPan || '-'}</td>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px', fontWeight: 'bold' }}>Required Date</td>
            <td style={{ border: '1px solid #CCC', padding: '6px 8px' }}>{formatted.reqDate || '-'}</td>
          </tr>
        </tbody>
      </table>

      {/* PRICE BREAKDOWN */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', border: '1px solid #CCC', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ backgroundColor: '#4A4A4A', color: 'white' }}>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #4A4A4A' }}>PRICE BREAKDOWN</th>
            <th style={{ padding: '8px', textAlign: 'right', width: '150px', border: '1px solid #4A4A4A' }}>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '8px', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #CCC', borderLeft: '1px solid #CCC' }}>Vehicle / Equipment Hire Charges</td>
            <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #CCC' }}>{fmt(pricingBreakdown.hireCharges)}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #CCC', borderLeft: '1px solid #CCC' }}>Driver Charges</td>
            <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #CCC' }}>{fmt(pricingBreakdown.driverCharges)}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #CCC', borderLeft: '1px solid #CCC' }}>Fuel Charges</td>
            <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #CCC' }}>{fmt(pricingBreakdown.fuelCharges)}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #CCC', borderLeft: '1px solid #CCC' }}>Transportation / Mobilization</td>
            <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #CCC' }}>{fmt(pricingBreakdown.transportCharges)}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #CCC', borderLeft: '1px solid #CCC' }}>Other Charges</td>
            <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #CCC' }}>{fmt(pricingBreakdown.otherCharges)}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #CCC', borderLeft: '1px solid #CCC' }}>{formatted.gstLabel}</td>
            <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #CCC' }}>{formatted.gstAmount}</td>
          </tr>
          <tr style={{ backgroundColor: '#F3F4F6' }}>
            <td style={{ padding: '12px 8px', fontWeight: 'bold', border: '1px solid #CCC' }}>GRAND TOTAL</td>
            <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', border: '1px solid #CCC' }}>
              ₹ {formatted.grandTotal}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Terms and Signature */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #CCC', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ backgroundColor: '#F5F5F5' }}>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #CCC', width: '60%' }}>KEY TERMS</th>
            <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #CCC', color: '#F39200' }}>For {profile.companyName || 'AMMAN EARTH MOVERS'}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '12px 8px', border: '1px solid #CCC', verticalAlign: 'top' }}>
              <ul style={{ margin: 0, paddingLeft: '16px', color: '#555', lineHeight: '1.6' }}>
                {formatted.termsList.map((term, i) => {
                  const cleanTerm = term.replace(/^[0-9]+\.\s*/, '');
                  return <li key={i} style={{ marginBottom: '6px' }}>{cleanTerm}</li>;
                })}
              </ul>
            </td>
            <td style={{ padding: '12px 8px', border: '1px solid #CCC', verticalAlign: 'bottom', position: 'relative' }}>
              <SignatureBlock
                companyName={profile?.companyName}
                authorizedSignatory="Authorized Signatory"
                hideCompanyLabel={true}
              />
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  );
});

export default QuotationTemplate;
