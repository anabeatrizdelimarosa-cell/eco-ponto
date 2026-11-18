import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return  # Capa limpa sem header/footer

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))

        # Cabeçalho
        self.drawString(40, 800, "EcoPonto Inteligente • Programa Centelha 3 Rondônia (Edital 03/2026)")
        self.drawRightString(555, 800, "Estudante: Ana Beatriz de Lima Rosa — 3°B Informática")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(40, 792, 555, 792)

        # Rodapé
        self.line(40, 45, 555, 45)
        self.drawString(40, 32, "Sistema em execução local: http://localhost:3011 | EEEFM Carmela Dutra — Porto Velho/RO")
        page_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(555, 32, page_text)
        self.restoreState()


def gerar_relatorio_pdf():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    screenshots_dir = os.path.join(base_dir, "screenshots")
    pdf_filename = "ECOPONTO_CATALOGO_VISUAL_E_RELATORIO.pdf"
    output_pdf = os.path.join(base_dir, pdf_filename)

    doc = SimpleDocTemplate(
        output_pdf,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=55,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()

    # Estilos Customizados
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#064e3b'),
        alignment=1, # Centralizado
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#047857'),
        alignment=1,
        spaceAfter=25
    )

    h1_style = ParagraphStyle(
        'SecHeading1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#064e3b'),
        spaceBefore=14,
        spaceAfter=8
    )

    h2_style = ParagraphStyle(
        'SecHeading2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=15,
        bulletIndent=5,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#065f46')
    )

    story = []

    # =========================================================================
    # CAPA DO DOCUMENTO
    # =========================================================================
    story.append(Spacer(1, 30))
    story.append(Paragraph("ECOPONTO INTELIGENTE", title_style))
    story.append(Paragraph("Relatório Técnico Integrado & Catálogo Visual Completo de Telas", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#059669"), spaceAfter=20))

    # Tabela de Metadados Acadêmicos
    meta_data = [
        [Paragraph("<b>Projeto:</b>", body_style), Paragraph("EcoPonto Inteligente — Coleta Seletiva Rastreável e IoT", body_style)],
        [Paragraph("<b>Programa:</b>", body_style), Paragraph("Simulado Programa Centelha 3 Rondônia (Edital nº 03/2026 — Fase 1)", body_style)],
        [Paragraph("<b>Estudante / Autora:</b>", body_style), Paragraph("Ana Beatriz de Lima Rosa", body_style)],
        [Paragraph("<b>Turma e Curso:</b>", body_style), Paragraph("3°B Técnico em Informática", body_style)],
        [Paragraph("<b>Instituição de Ensino:</b>", body_style), Paragraph("EEEFM Carmela Dutra — Porto Velho / Rondônia", body_style)],
        [Paragraph("<b>Área do Conhecimento:</b>", body_style), Paragraph("Desenvolvimento de Software, Internet das Coisas (IoT) e Ciência de Dados", body_style)],
        [Paragraph("<b>Status de Execução:</b>", body_style), Paragraph("<b>100% Concluído e Operacional</b> (Porta Local: http://localhost:3011)", body_style)],
        [Paragraph("<b>Link do Vídeo Pitch:</b>", body_style), Paragraph("https://youtube.com/shorts/jQ7sv5xjBv8", body_style)],
    ]

    t_meta = Table(meta_data, colWidths=[140, 375])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 25))

    # Box Resumo Executivo
    resumo_html = """
    <b>RESUMO EXECUTIVO DO SISTEMA:</b><br/>
    O <b>EcoPonto Inteligente</b> é uma plataforma web/mobile concebida para enfrentar o cenário crítico diagnosticado em Rondônia, onde <b>57,7% dos municípios do estado não possuem serviço de coleta seletiva estruturada</b> (dados oficiais do Governo de RO / SINIR+). 
    A solução integra de forma pioneira a educação ambiental cidadã, o catálogo oficial de triagem (CONAMA), a geolocalização interativa de ecopontos com detecção de onde o usuário já descartou, telemetria de sensores IoT de ocupação, gamificação com Pontos Verdes, emissão de Certificados Digitais com QR Code e um Painel Administrativo de Auditoria Governamental para a Secretaria Municipal de Meio Ambiente (SEMA).
    """
    callout_data = [[Paragraph(resumo_html, callout_style)]]
    t_callout = Table(callout_data, colWidths=[515])
    t_callout.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ecfdf5')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#10b981')),
        ('PADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(t_callout)
    story.append(PageBreak())

    # =========================================================================
    # SEÇÃO 1: ARQUITETURA E RESUMO DAS FUNCIONALIDADES
    # =========================================================================
    story.append(Paragraph("1. Arquitetura Técnica & Banco de Dados", h1_style))
    story.append(Paragraph(
        "O sistema foi construído sobre uma pilha moderna de alto desempenho e tipagem estrita, garantindo persistência de dados local auditável e responsividade em múltiplos dispositivos:",
        body_style
    ))

    story.append(Paragraph("• <b>Frontend Responsivo:</b> React 19 com TypeScript, arquitetura de componentes modulares, ícones vetorizados via Lucide React e layout otimizado para desktop e mobile.", bullet_style))
    story.append(Paragraph("• <b>Servidor e Build:</b> Vite 8 com Hot Module Replacement e servidor local configurado estritamente na porta <b>3011</b> (http://localhost:3011).", bullet_style))
    story.append(Paragraph("• <b>Banco de Dados Local (src/db.ts):</b> Estrutura relacional persistida com tabelas de Usuários (com controle de status Ativo/Bloqueado), Ecopontos e telemetria, Despachos georreferenciados, Catálogo de Materiais e Campanhas.", bullet_style))
    story.append(Paragraph("• <b>Módulo de Telemetria IoT:</b> Simulação em tempo real da leitura percentual de sensores ultrassônicos instalados em recipientes de coleta, com disparo automático de status 'Lotado' ao atingir 90%.", bullet_style))
    story.append(Paragraph("• <b>Certificação com QR Code:</b> Emissão instantânea de certificados digitais de destinação ecológica com código hash único (ex: ECO-RO-2026-001) e suporte nativo a impressão física.", bullet_style))
    story.append(Spacer(1, 15))

    story.append(Paragraph("2. Dados Reais Integrados de Rondônia", h1_style))
    tabela_dados_ro = [
        [Paragraph("<b>Indicador / Entidade</b>", body_style), Paragraph("<b>Dado Real Integrado no Sistema</b>", body_style), Paragraph("<b>Fonte Oficial</b>", body_style)],
        [Paragraph("Defasagem de Coleta Seletiva", body_style), Paragraph("57,7% dos municípios de RO sem coleta seletiva regular", body_style), Paragraph("Governo de Rondônia / SINIR+ (2025)", body_style)],
        [Paragraph("Geração de Resíduos na Capital", body_style), Paragraph("Aprox. 450 a 500 toneladas diárias de RSU", body_style), Paragraph("Prefeitura Municipal de Porto Velho", body_style)],
        [Paragraph("Cooperativa Parceira 1", body_style), Paragraph("CATANORTE — Rua da Beira, 4520, Bairro Lagoa (Porto Velho)", body_style), Paragraph("Assoc. de Catadores de RO", body_style)],
        [Paragraph("Cooperativa Parceira 2", body_style), Paragraph("ASPREVEL — Av. dos Imigrantes, 4100, São Sebastião", body_style), Paragraph("Cooperativa de Catadores", body_style)],
        [Paragraph("Ecoponto Central do Interior", body_style), Paragraph("SEMAM Ji-Paraná — Av. Marechal Rondon, 890", body_style), Paragraph("Prefeitura de Ji-Paraná", body_style)],
        [Paragraph("Ponto Escolar Sustentável", body_style), Paragraph("EEEFM Carmela Dutra — Av. Farquar, 2550, Panair", body_style), Paragraph("SEDUC-RO (CEP 76801-329)", body_style)],
        [Paragraph("Valor das Latinhas de Alumínio", body_style), Paragraph("R$ 6,80 / kg (líder nacional em reciclagem com 98,7%)", body_style), Paragraph("ABAL / Recicla Latas", body_style)],
        [Paragraph("Impacto Climático do Alumínio", body_style), Paragraph("Evita 9,13 kg de CO2e por kg reciclado (economia de 95% energia)", body_style), Paragraph("Inventário Nacional MMA/IPEA", body_style)],
    ]
    t_ro = Table(tabela_dados_ro, colWidths=[140, 240, 135])
    t_ro.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#064e3b')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_ro)
    story.append(PageBreak())

    # =========================================================================
    # SEÇÃO 3: CATÁLOGO VISUAL DE TODAS AS 15 TELAS
    # =========================================================================
    story.append(Paragraph("3. Catálogo Completo das 15 Telas e Módulos do Sistema", h1_style))
    story.append(Paragraph(
        "Abaixo são apresentadas as capturas reais de cada uma das telas construídas na plataforma, acompanhadas de sua especificação técnica e regras de negócio:",
        body_style
    ))
    story.append(Spacer(1, 10))

    telas_info = [
        {
            "num": "01",
            "nome": "Mapa Interativo & Meus Despachos",
            "arquivo": "01_mapa_interativo.png",
            "modulo": "Geolocalização / Cidadão",
            "desc": "Apresenta a base cartográfica de Rondônia destacando o Rio Madeira, Av. Sete de Setembro e Av. Rio Madeira (BR-364). Exibe pinos verdes para ecopontos da rede e pinos azuis com selo de verificação destacando EXATAMENTE onde o usuário autenticado já realizou despachos de lixo, com inspetor lateral de dados."
        },
        {
            "num": "02",
            "nome": "Rede de Ecopontos e Cooperativas",
            "arquivo": "02_pontos_coleta.png",
            "modulo": "Localização & Telemetria",
            "desc": "Listagem em cards detalhados de todos os pontos de coleta credenciados (SEMA Porto Velho, CATANORTE, ASPREVEL, EEEFM Carmela Dutra e SEMAM Ji-Paraná). Permite busca textual, filtros por material aceito e visualização da taxa de ocupação dos sensores IoT."
        },
        {
            "num": "03",
            "nome": "Histórico de Despachos & Comprovantes",
            "arquivo": "03_meus_despachos.png",
            "modulo": "Rastreabilidade Pessoal",
            "desc": "Tabela de prestação de contas pessoal do usuário. Lista data, ecoponto de destino, tipo de resíduo, peso aferido, CO2 evitado e botão de acesso ao Certificado Digital com QR Code auditável."
        },
        {
            "num": "04",
            "nome": "Registrar Despacho de Resíduos",
            "arquivo": "04_registrar_despacho.png",
            "modulo": "Operação de Entrega",
            "desc": "Formulário de lançamento de recicláveis com validação. Calcula em tempo real o crédito de Pontos Verdes (+10 pts/kg), o impacto de carbono poupado e a renda estimada para os catadores, emitindo o comprovante instantaneamente."
        },
        {
            "num": "05",
            "nome": "Painel Administrativo: Gestão de Usuários",
            "arquivo": "05_painel_admin_usuarios.png",
            "modulo": "Administração Governamental (SEMA)",
            "desc": "Módulo exclusivo do gestor público para consultar todos os usuários cadastrados, visualizar dados de contato, saldo de pontos, alterar níveis de acesso (Cidadão, Cooperativa, Escola, Admin) e bloquear/desbloquear contas."
        },
        {
            "num": "06",
            "nome": "Painel Administrativo: Ecopontos & Sensores IoT",
            "arquivo": "06_painel_admin_ecopontos_iot.png",
            "modulo": "Telemetria & Infraestrutura",
            "desc": "Controle dos pontos físicos e recipientes de coleta. Inclui controles deslizantes (sliders) para simular leituras de sensores ultrassônicos em tempo real, disparando alertas de lotação (>90%), além de cadastro e exclusão de ecopontos."
        },
        {
            "num": "07",
            "nome": "Painel Administrativo: Preços e Fatores de CO2",
            "arquivo": "07_painel_admin_precos.png",
            "modulo": "Economia Circular & Clima",
            "desc": "Tabela paramétrica dos 6 grupos de materiais recicláveis. Permite ao gestor municipal editar o valor pago por kg aos catadores (R$) e os coeficientes de emissão evitada de CO2e, recalculando automaticamente os indicadores da rede."
        },
        {
            "num": "08",
            "nome": "Painel Administrativo: Auditoria de Cargas & Exportação",
            "arquivo": "08_painel_admin_auditoria.png",
            "modulo": "Auditoria Governamental",
            "desc": "Registro auditável centralizado de todos os despachos estaduais com código de autenticação, data/hora e valores. Conta com botões de Exportação CSV imediata e Backup completo em JSON para prestação de contas ao Centelha 3."
        },
        {
            "num": "09",
            "nome": "Guia Oficial de Descarte (Padrão CONAMA)",
            "arquivo": "09_guia_descarte.png",
            "modulo": "Educação Ambiental",
            "desc": "Guia técnico com cores normativas e instruções práticas de preparação de materiais (lavagem com água de reúso, secagem, desmonte de caixas e cuidados com vidros quebrados para proteção física de catadores)."
        },
        {
            "num": "10",
            "nome": "Indicadores Socioambientais de Rondônia",
            "arquivo": "10_indicadores_ro.png",
            "modulo": "Business Intelligence & BI",
            "desc": "Painel de métricas e KPIs consolidados. Destaca o volume total reciclado na rede estadual, o CO2 evitado, a defasagem de 57,7% de municípios de Rondônia sem coleta seletiva e a quantidade de pontos ativos."
        },
        {
            "num": "11",
            "nome": "Campanhas Comunitárias e Escolares",
            "arquivo": "11_campanhas.png",
            "modulo": "Engajamento Social",
            "desc": "Monitoramento de campanhas ativas, incluindo a 'Gincana Escolar da Turma 3°B Informática da EEEFM Carmela Dutra' e a campanha 'Óleo no Rio Nunca Mais: Protegendo o Rio Madeira', com barras de progresso percentual e metas em kg."
        },
        {
            "num": "12",
            "nome": "Ficha Acadêmica do Simulado Centelha 3 (Fase 1)",
            "arquivo": "12_ficha_centelha.png",
            "modulo": "Documentação Oficial do Edital",
            "desc": "Ficha completa da proposta de Ana Beatriz de Lima Rosa, contendo a identificação da aluna, evidências do problema no SINIR/Governo de RO, capacidade de execução individual e link direto para o vídeo pitch no YouTube."
        },
        {
            "num": "13",
            "nome": "Portal de Autenticação: Tela de Login",
            "arquivo": "13_auth_login.png",
            "modulo": "Segurança & Acesso",
            "desc": "Interface corporativa de login com campos de e-mail e senha, atalhos rápidos de acesso para demonstração com 1 clique (Ana Beatriz, Catanorte, Direção Escolar, SEMA) e links para criação de conta e recuperação de credenciais."
        },
        {
            "num": "14",
            "nome": "Portal de Autenticação: Tela de Cadastro",
            "arquivo": "14_auth_cadastro.png",
            "modulo": "Onboarding de Usuários",
            "desc": "Formulário completo de abertura de conta com perfil personalizável (Cidadão, Escola, Cooperativa ou Admin), coleta de CPF/CNPJ, Telefone/WhatsApp, Bairro e Município em Rondônia, creditando 50 Pontos Verdes de bônus."
        },
        {
            "num": "15",
            "nome": "Portal de Autenticação: Recuperação de Senha",
            "arquivo": "15_auth_recuperar.png",
            "modulo": "Gestão de Credenciais",
            "desc": "Módulo de autosserviço para redefinição de senhas. Realiza a validação do e-mail cadastrado, verificação por código simulado de 4 dígitos (2026) e redefinição instantânea da nova senha no banco de dados local."
        },
    ]

    for item in telas_info:
        img_path = os.path.join(screenshots_dir, item["arquivo"])
        
        elem_list = []
        elem_list.append(Paragraph(f"Tela {item['num']} — {item['nome']}", h2_style))
        elem_list.append(Paragraph(f"<b>Módulo:</b> {item['modulo']}", body_style))
        elem_list.append(Paragraph(item['desc'], body_style))

        if os.path.exists(img_path):
            try:
                # Dimensões da imagem proporcional para A4 (515 pt de largura)
                img = Image(img_path, width=500, height=315)
                elem_list.append(Spacer(1, 4))
                elem_list.append(img)
            except Exception as e:
                elem_list.append(Paragraph(f"[Imagem não carregada: {e}]", body_style))
        else:
            elem_list.append(Paragraph(f"[Arquivo de print não encontrado em: {img_path}]", body_style))

        elem_list.append(Spacer(1, 15))
        story.append(KeepTogether(elem_list))

    # =========================================================================
    # SEÇÃO 4: CRITÉRIOS DE AVALIAÇÃO DA BANCA CENTELHA 3
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("4. Matriz de Avaliação do Simulado Centelha 3 Rondônia", h1_style))
    story.append(Paragraph(
        "A avaliação formal da proposta segue as diretrizes do Edital nº 03/2026 — Centelha 3 Rondônia (Fase 1: Ideias Inovadoras), consolidando as notas dos quatro pilares fundamentais:",
        body_style
    ))

    tabela_criterios = [
        [Paragraph("<b>Critério de Avaliação</b>", body_style), Paragraph("<b>O Que É Observado Pela Banca</b>", body_style), Paragraph("<b>Peso</b>", body_style), Paragraph("<b>Status no MVP</b>", body_style)],
        [Paragraph("<b>Solução (S)</b>", body_style), Paragraph("Clareza da solução proposta, grau de inovação frente a alternativas e integração de IoT.", body_style), Paragraph("Peso 2", body_style), Paragraph("100% Implementado", body_style)],
        [Paragraph("<b>Mercado (M)</b>", body_style), Paragraph("Qualidade da oportunidade identificada, demanda de cooperativas e modelo para escolas.", body_style), Paragraph("Peso 1", body_style), Paragraph("100% Implementado", body_style)],
        [Paragraph("<b>Impacto Socioambiental (I)</b>", body_style), Paragraph("Potencial de aumento na reciclagem, geração de renda para catadores e desvio de aterros.", body_style), Paragraph("Peso 1", body_style), Paragraph("100% Implementado", body_style)],
        [Paragraph("<b>Capacidade de Execução (E)</b>", body_style), Paragraph("Domínio do tema/tecnologia demonstrado pela estudante no desenvolvimento do MVP e no pitch.", body_style), Paragraph("Peso 1", body_style), Paragraph("100% Implementado", body_style)],
    ]
    t_crit = Table(tabela_criterios, colWidths=[120, 215, 60, 120])
    t_crit.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#064e3b')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_crit)
    story.append(Spacer(1, 15))

    story.append(Paragraph(
        "<b>Fórmula Oficial da Nota da Fase 1:</b><br/>"
        "<font size='11' color='#065f46'><b>Nota Final = (2 × Solução + Mercado + Impacto + Execução) ÷ 5</b></font>",
        body_style
    ))

    story.append(Spacer(1, 20))
    story.append(Paragraph(
        "Documento gerado automaticamente pelo ambiente de desenvolvimento do projeto <b>EcoPonto Inteligente</b>. Todas as telas, tabelas e dados reais encontram-se ativos e testáveis no servidor local em <b>http://localhost:3011</b>.",
        body_style
    ))

    # Construção do PDF com canvas numerado
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF gerado com sucesso em: {output_pdf}")

    # Copiar também para a raiz do workspace
    parent_dir = os.path.dirname(base_dir)
    dest_pdf = os.path.join(parent_dir, pdf_filename)
    try:
        import shutil
        shutil.copyfile(output_pdf, dest_pdf)
        print(f"Cópia criada na raiz: {dest_pdf}")
    except Exception as e:
        print(f"Aviso cópia: {e}")

if __name__ == "__main__":
    gerar_relatorio_pdf()
