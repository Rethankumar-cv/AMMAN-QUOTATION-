import React from 'react';
import SignatureBlock from './SignatureBlock';

const ChallanTemplate = React.forwardRef(({ data, profile }, ref) => {
  const { items = [], pricing = {} } = data;

  // Format currency helper
  const fmt = (val) => val && Number(val) !== 0 ? Number(val).toLocaleString('en-IN') : '0';
  const fmtEmptyStr = (val) => val ? val : '-';

  return (
    <div 
      ref={ref}
      style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        lineHeight: '1.4',
        width: '794px', 
        minHeight: '1123px', 
        boxSizing: 'border-box',
        WebkitTextSizeAdjust: 'none', 
        textSizeAdjust: 'none',       
        margin: '0 auto',
        boxShadow: 'none', 
        borderRadius: '0'
      }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
        <div>
          <img src="/assets/logo.png" alt="Amman Earth Movers Logo" style={{ height: '70px', objectFit: 'contain', maxWidth: '250px' }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#4A4A4A', margin: '0 0 2px 0' }}>{profile?.companyName || 'AMMAN EARTH MOVERS'}</h2>
          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#F39200', fontWeight: 'bold' }}>{profile?.tagline || 'Heavy Earthmoving & Vehicle Solutions'}</p>
          <p style={{ margin: '0 0 2px 0', color: '#666', fontSize: '10px' }}>{profile?.address || '60-A, NGR Street, Kalapatti, Coimbatore - 641 048'}</p>
          {profile?.email && <p style={{ margin: '0 0 2px 0', color: '#666', fontSize: '10px' }}>E-mail: {profile.email}</p>}
          <p style={{ margin: 0, color: '#666', fontSize: '10px' }}>Contact: {profile?.contact || '9842267585 | 9842867585'}</p>
          <p style={{ margin: '2px 0 0 0', color: '#666', fontSize: '10px' }}>GSTIN: {data.billFrom?.gst || '33AOMPC9735L1ZK'}</p>
        </div>
      </div>

      {/* Title Bar */}
      <div style={{ backgroundColor: '#F39200', color: 'white', textAlign: 'center', padding: '6px 0', fontWeight: 'bold', fontSize: '14px', marginBottom: '16px' }}>
        DELIVERY CHALLAN
      </div>

      {/* Main Info Row */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #CCC', padding: '6px', width: '25%' }}><strong>DC No:</strong> <br/>{fmtEmptyStr(data.dcNo)}</td>
            <td style={{ border: '1px solid #CCC', padding: '6px', width: '25%' }}><strong>Date:</strong> <br/>{fmtEmptyStr(data.date)}</td>
            <td style={{ border: '1px solid #CCC', padding: '6px', width: '25%' }}><strong>E-Way Bill No:</strong> <br/>{fmtEmptyStr(data.eWayBillNo)}</td>
            <td style={{ border: '1px solid #CCC', padding: '6px', width: '25%' }}><strong>Transporter:</strong> <br/>{fmtEmptyStr(data.transporterName)}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #CCC', padding: '6px' }}><strong>Time:</strong> <br/>{fmtEmptyStr(data.time)}</td>
            <td style={{ border: '1px solid #CCC', padding: '6px' }}><strong>Vehicle No:</strong> <br/>{fmtEmptyStr(data.vehicleNo)}</td>
            <td style={{ border: '1px solid #CCC', padding: '6px' }}><strong>Reason:</strong> <br/>{fmtEmptyStr(data.reason)}</td>
            <td style={{ border: '1px solid #CCC', padding: '6px' }}><strong>Transaction Type:</strong> <br/>{fmtEmptyStr(data.transactionType)}</td>
          </tr>
        </tbody>
      </table>

      {/* Two-column Party Section */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ backgroundColor: '#E5E7EB' }}>
            <th style={{ border: '1px solid #CCC', padding: '6px', width: '50%', textAlign: 'center' }}>BILL FROM</th>
            <th style={{ border: '1px solid #CCC', padding: '6px', width: '50%', textAlign: 'center' }}>BILL TO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #CCC', padding: '8px', verticalAlign: 'top', height: '60px' }}>
              <strong>{data.billFrom?.name}</strong><br/>
              {data.billFrom?.gst && <>GSTIN: {data.billFrom.gst}<br/></>}
              {data.billFrom?.address && <>{data.billFrom.address}<br/></>}
              {data.billFrom?.state && <>{data.billFrom.state}</>}
            </td>
            <td style={{ border: '1px solid #CCC', padding: '8px', verticalAlign: 'top', height: '60px' }}>
              <strong>{data.billTo?.name}</strong><br/>
              {data.billTo?.gst && <>GSTIN: {data.billTo.gst}<br/></>}
              {data.billTo?.address && <>{data.billTo.address}<br/></>}
              {data.billTo?.state && <>{data.billTo.state}</>}
            </td>
          </tr>
          <tr style={{ backgroundColor: '#E5E7EB' }}>
            <th style={{ border: '1px solid #CCC', padding: '6px', textAlign: 'center' }}>DISPATCH FROM</th>
            <th style={{ border: '1px solid #CCC', padding: '6px', textAlign: 'center' }}>SHIP TO</th>
          </tr>
          <tr>
            <td style={{ border: '1px solid #CCC', padding: '8px', verticalAlign: 'top', height: '60px' }}>
              {data.dispatchFrom?.address1 && <>{data.dispatchFrom.address1}<br/></>}
              {data.dispatchFrom?.address2 && <>{data.dispatchFrom.address2}<br/></>}
              {data.dispatchFrom?.cityStatePin && <>{data.dispatchFrom.cityStatePin}</>}
            </td>
            <td style={{ border: '1px solid #CCC', padding: '8px', verticalAlign: 'top', height: '60px' }}>
              {data.shipTo?.address1 && <>{data.shipTo.address1}<br/></>}
              {data.shipTo?.address2 && <>{data.shipTo.address2}<br/></>}
              {data.shipTo?.cityStatePin && <>{data.shipTo.cityStatePin}</>}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Item Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0', borderBottom: '1px solid #CCC', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ backgroundColor: '#E5E7EB' }}>
            <th style={{ border: '1px solid #CCC', padding: '6px', width: '8%', textAlign: 'center' }}>SNO</th>
            <th style={{ border: '1px solid #CCC', padding: '6px', width: '42%', textAlign: 'left' }}>DESCRIPTION OF GOODS</th>
            <th style={{ border: '1px solid #CCC', padding: '6px', width: '15%', textAlign: 'center' }}>HSN CODE</th>
            <th style={{ border: '1px solid #CCC', padding: '6px', width: '10%', textAlign: 'center' }}>QTY</th>
            <th style={{ border: '1px solid #CCC', padding: '6px', width: '10%', textAlign: 'center' }}>RATE</th>
            <th style={{ border: '1px solid #CCC', padding: '6px', width: '15%', textAlign: 'center' }}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={{ borderLeft: '1px solid #CCC', borderRight: '1px solid #CCC', borderBottom: '1px solid #E5E7EB', padding: '6px', textAlign: 'center' }}>{item.sno}</td>
              <td style={{ borderLeft: '1px solid #CCC', borderRight: '1px solid #CCC', borderBottom: '1px solid #E5E7EB', padding: '6px' }}>{item.description}</td>
              <td style={{ borderLeft: '1px solid #CCC', borderRight: '1px solid #CCC', borderBottom: '1px solid #E5E7EB', padding: '6px', textAlign: 'center' }}>{item.hsn}</td>
              <td style={{ borderLeft: '1px solid #CCC', borderRight: '1px solid #CCC', borderBottom: '1px solid #E5E7EB', padding: '6px', textAlign: 'center' }}>{item.qty}</td>
              <td style={{ borderLeft: '1px solid #CCC', borderRight: '1px solid #CCC', borderBottom: '1px solid #E5E7EB', padding: '6px', textAlign: 'center' }}>{fmt(item.rate)}</td>
              <td style={{ borderLeft: '1px solid #CCC', borderRight: '1px solid #CCC', borderBottom: '1px solid #E5E7EB', padding: '6px', textAlign: 'center' }}>{fmt(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Value Summary Section */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #CCC', borderTop: 'none', tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            <td style={{ width: '45%', verticalAlign: 'top', padding: '0', borderRight: '1px solid #CCC' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td colSpan="2" style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #CCC' }}>VALUE SUMMARY</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 8px', borderBottom: '1px solid #E5E7EB' }}>TOTAL</td>
                    <td style={{ padding: '6px 8px', borderBottom: '1px solid #E5E7EB', textAlign: 'right' }}>{fmt(pricing.subtotal)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 8px', borderBottom: '1px solid #E5E7EB' }}>CGST</td>
                    <td style={{ padding: '6px 8px', borderBottom: '1px solid #E5E7EB', textAlign: 'right' }}>{fmt(pricing.cgst)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 8px', borderBottom: '1px solid #E5E7EB' }}>SGST</td>
                    <td style={{ padding: '6px 8px', borderBottom: '1px solid #E5E7EB', textAlign: 'right' }}>{fmt(pricing.sgst)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 8px', borderBottom: '1px solid #E5E7EB' }}>ROUND OFF</td>
                    <td style={{ padding: '6px 8px', borderBottom: '1px solid #E5E7EB', textAlign: 'right' }}>{pricing.roundOff}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #CCC' }}>VALUE / GRAND TOTAL</td>
                    <td style={{ padding: '8px', fontWeight: 'bold', textAlign: 'right', borderBottom: '1px solid #CCC' }}>{fmt(pricing.grandTotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ padding: '8px', verticalAlign: 'top' }}>
                      <strong>KEY TERMS</strong>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#555', marginTop: '4px', lineHeight: '1.4' }}>
                        {data.notes}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td style={{ width: '55%', verticalAlign: 'bottom', padding: '16px' }}>
              <div style={{ marginBottom: '40px' }}>
                <SignatureBlock 
                  companyName={profile?.companyName} 
                  authorizedSignatory={data.authorizedSignatory} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', whiteSpace: 'nowrap' }}>Receiver Signature:</span>
                <div style={{ flex: 1, maxWidth: '250px', borderBottom: '1px solid #000' }}></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  );
});

export default ChallanTemplate;
