const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#fff', color: '#333', fontSize: 14, fontFamily: 'Arial, sans-serif' }}>
      <hr  style={{opacity: '0.2'}}/>  
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '48px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 48,
          color: '#222',
        }}
      >
        <div style={{ lineHeight: 1.6 }}>
          <p>
            A Clínica Médica SESI tem especialidades que você precisa, ótimo atendimento e praticidade.
            Nossa Clínica possui ótima infra-estrutura e acessibilidade.
          </p>
          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <a
              href="#"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#555',
                textDecoration: 'none',
                fontSize: 16,
              }}
              aria-label="Instagram"
            >
              <i className="fa fa-instagram" aria-hidden="true"></i> {/* Se quiser usar ícone, senão pode deixar texto */}
              IG
            </a>
            <a
              href="#"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#555',
                textDecoration: 'none',
                fontSize: 16,
              }}
              aria-label="Facebook"
            >
              FB
            </a>
          </div>
        </div>
        <div>
          <h3 style={{ color: '#1E90FF', fontWeight: '600', fontSize: 18, marginBottom: 24 }}>
            Atendimento
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'normal', fontSize: 14 }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}>
              <li>Início</li>
              <li>Contato</li>
              <li>Especialidades</li>
              <li>Plano Setemed</li>
            </ul>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}>
              <li>Agendamentos</li>
              <li>Sobre</li>
              <li>Endereço</li>
            </ul>
          </div>
        </div>
        <div>
          <h3 style={{ color: '#1E90FF', fontWeight: '600', fontSize: 18, marginBottom: 24 }}>
            Localização
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2, color: '#222' }}>
            <li>R. Ver. Osvaldo de Oliveira, 3800</li>
            <li>Centro, Palhoça – SC, 88131-200</li>
            <li style={{ marginTop: 16, color: '#b03b66' }}>
              📞 (48) 0000-0000
            </li>
            <li style={{ color: '#b03b66' }}>
              📱 (48) 00000-0000
            </li>
            <li style={{ color: '#b03b66' }}>
              ✉ contato@clinicasesi.com.br
            </li>
            <li style={{ color: '#b03b66' }}>
              🕒 Segunda à Sexta: 07h às 19h
            </li>
            <li style={{ color: '#b03b66' }}>
              🕒 Sábado: 07h30 às 12h
            </li>
          </ul>
        </div>
      </div>
      <div
        style={{
          borderTop: '1px solid #ddd',
          fontSize: 12,
          color: '#777',
          padding: '8px 0 0 0',
          textAlign: 'center',
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: 24,
          paddingRight: 24,
          fontWeight: '500',
        }}
      >
      </div>
      <div
        style={{
          backgroundColor: '#1E90FF',
          color: 'white',
          textAlign: 'center',
          padding: '16px 24px',
          fontSize: 14,
          fontWeight: '500',
          marginTop: 24,
        }}
      >
        ©2025. Setemed Clínica Médica SESI. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
