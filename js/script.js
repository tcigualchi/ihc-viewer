
        document.addEventListener('DOMContentLoaded', function() {
            const analyzeBtn = document.getElementById('analyze-btn');
            const urlInput = document.getElementById('url-input');
            const loadingElement = document.getElementById('loading');
            const resultsElement = document.getElementById('results');
            const tabs = document.querySelectorAll('.tab');
            const tabContents = document.querySelectorAll('.tab-content');

            // Configuração dos tabs
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    tab.classList.add('active');
                    const tabId = tab.getAttribute('data-tab') + '-tab';
                    document.getElementById(tabId).classList.add('active');
                });
            });

            analyzeBtn.addEventListener('click', analyzeWebsite);

            urlInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    analyzeWebsite();
                }
            });

            async function analyzeWebsite() {
                const url = urlInput.value.trim();
                
                if (!url) {
                    alert('Por favor, insira uma URL válida');
                    return;
                }
                
                // Mostrar loading e esconder resultados
                loadingElement.style.display = 'block';
                resultsElement.style.display = 'none';
                
                try {
                    // Limpar resultados anteriores
                    clearPreviousResults();
                    
                    // Obter o conteúdo do site via proxy CORS
                    const response = await fetch(`https://thingproxy.freeboard.io/fetch/${url}`);
                    const data = await response.json();
                    
                    if (data.contents) {
                        // Criar um documento temporário para análise
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(data.contents, 'text/html');
                        
                        // Executar todas as análises
                        runAllAnalyses(doc, url);
                        
                        // Mostrar resultados
                        loadingElement.style.display = 'none';
                        resultsElement.style.display = 'block';
                    } else {
                        throw new Error('Não foi possível acessar o site. Verifique a URL e tente novamente.');
                    }
                } catch (error) {
                    loadingElement.style.display = 'none';
                    alert(`Erro ao analisar o site: ${error.message}`);
                    console.error('Erro na análise:', error);
                }
            }

            function clearPreviousResults() {
                // Limpar todos os resultados anteriores
                document.getElementById('summary').innerHTML = '';
                document.getElementById('contrast-results').innerHTML = '';
                document.getElementById('form-issues').innerHTML = '';
                document.getElementById('aria-issues').innerHTML = '';
                document.getElementById('semantic-issues').innerHTML = '';
                document.getElementById('heading-issues').innerHTML = '';
                document.getElementById('image-issues').innerHTML = '';
                document.getElementById('link-issues').innerHTML = '';
                document.getElementById('font-size-results').innerHTML = '';
                document.getElementById('responsive-issues').innerHTML = '';
                document.getElementById('spacing-issues').innerHTML = '';
                document.getElementById('usability-issues').innerHTML = '';
                document.getElementById('performance-issues').innerHTML = '';
                document.getElementById('interaction-issues').innerHTML = '';
            }

            function runAllAnalyses(doc, originalUrl) {
                // Executar todas as análises e popular os resultados
                const accessibilityResults = analyzeAccessibility(doc);
                const semanticResults = analyzeSemantics(doc);
                const designResults = analyzeDesign(doc);
                const usabilityResults = analyzeUsability(doc);
                
                // Gerar resumo
                generateSummary(accessibilityResults, semanticResults, designResults, usabilityResults);
                
                // Popular as abas com os resultados detalhados
                populateAccessibilityTab(accessibilityResults);
                populateSemanticsTab(semanticResults);
                populateDesignTab(designResults);
                populateUsabilityTab(usabilityResults);
                
                // Atualizar texto de visão geral
                document.getElementById('overview-text').textContent = 
                    `Análise completa do site ${originalUrl}. Foram encontrados ${accessibilityResults.issues.length + semanticResults.issues.length + designResults.issues.length + usabilityResults.issues.length} problemas potenciais de IHC.`;
            }

            function populateAccessibilityTab(results) {
            const contrastContainer = document.getElementById('contrast-results');
            const formList = document.getElementById('form-issues');
            const ariaList = document.getElementById('aria-issues');

            contrastContainer.innerHTML = '';
            results.contrastIssues.forEach(issue => {
                const div = document.createElement('div');
                div.className = `issue ${issue.severity}`;
                div.innerHTML = `
                    <h4>${issue.message}</h4>
                    <p>${issue.details}</p>
                    <div class="code-example">${issue.element}</div>
                `;
                contrastContainer.appendChild(div);
            });

            formList.innerHTML = '';
            results.formIssues.forEach(issue => {
                const li = document.createElement('li');
                li.className = `issue ${issue.severity}`;
                li.innerHTML = `
                    <h4>${issue.message}</h4>
                    <p>${issue.details}</p>
                    <div class="code-example">${issue.codeExample}</div>
                `;
                formList.appendChild(li);
            });

            ariaList.innerHTML = '';
            results.ariaIssues.forEach(issue => {
                const li = document.createElement('li');
                li.className = `issue ${issue.severity}`;
                li.innerHTML = `
                    <h4>${issue.message}</h4>
                    <p>${issue.details}</p>
                    <div class="code-example">${issue.codeExample}</div>
                `;
                ariaList.appendChild(li);
            });
        }

        function populateSemanticsTab(results) {
            const semanticList = document.getElementById('semantic-issues');
            const headingList = document.getElementById('heading-issues');
            const imageList = document.getElementById('image-issues');
            const linkList = document.getElementById('link-issues');

            semanticList.innerHTML = '';
            results.semanticIssues.forEach(issue => {
                const li = document.createElement('li');
                li.className = `issue ${issue.severity}`;
                li.innerHTML = `<h4>${issue.message}</h4><p>${issue.details}</p><div class="code-example">${issue.codeExample}</div>`;
                semanticList.appendChild(li);
            });

            headingList.innerHTML = '';
            results.headingIssues.forEach(issue => {
                const li = document.createElement('li');
                li.className = `issue ${issue.severity}`;
                li.innerHTML = `<h4>${issue.message}</h4><p>${issue.details}</p><div class="code-example">${issue.codeExample}</div>`;
                headingList.appendChild(li);
            });

            imageList.innerHTML = '';
            results.imageIssues.forEach(issue => {
                const li = document.createElement('li');
                li.className = `issue ${issue.severity}`;
                li.innerHTML = `<h4>${issue.message}</h4><p>${issue.details}</p><div class="code-example">${issue.codeExample}</div>`;
                imageList.appendChild(li);
            });

            linkList.innerHTML = '';
            results.linkIssues.forEach(issue => {
                const li = document.createElement('li');
                li.className = `issue ${issue.severity}`;
                li.innerHTML = `<h4>${issue.message}</h4><p>${issue.details}</p><div class="code-example">${issue.codeExample}</div>`;
                linkList.appendChild(li);
            });
        }

        function populateDesignTab(results) {
            const fontSizeContainer = document.getElementById('font-size-results');
            const responsiveList = document.getElementById('responsive-issues');
            const spacingList = document.getElementById('spacing-issues');

            fontSizeContainer.innerHTML = '';
            results.fontSizeIssues.forEach(issue => {
                const div = document.createElement('div');
                div.className = `issue ${issue.severity}`;
                div.innerHTML = `<h4>${issue.message}</h4><p>${issue.details}</p><div class="code-example">${issue.codeExample}</div>`;
                fontSizeContainer.appendChild(div);
            });

            responsiveList.innerHTML = '';
            results.responsiveIssues.forEach(issue => {
                const li = document.createElement('li');
                li.className = `issue ${issue.severity}`;
                li.innerHTML = `<h4>${issue.message}</h4><p>${issue.details}</p><div class="code-example">${issue.codeExample}</div>`;
                responsiveList.appendChild(li);
            });

            spacingList.innerHTML = '';
            results.spacingIssues.forEach(issue => {
                const li = document.createElement('li');
                li.className = `issue ${issue.severity}`;
                li.innerHTML = `<h4>${issue.message}</h4><p>${issue.details}</p><div class="code-example">${issue.codeExample}</div>`;
                spacingList.appendChild(li);
            });
        }

        function populateUsabilityTab(results) {
            const usabilityList = document.getElementById('usability-issues');
            const performanceList = document.getElementById('performance-issues');
            const interactionList = document.getElementById('interaction-issues');

            usabilityList.innerHTML = '';
            results.usabilityIssues.forEach(issue => {
                const li = document.createElement('li');
                li.className = `issue ${issue.severity}`;
                li.innerHTML = `<h4>${issue.message}</h4><p>${issue.details}</p><div class="code-example">${issue.codeExample}</div>`;
                usabilityList.appendChild(li);
            });

            performanceList.innerHTML = '';
            results.performanceIssues.forEach(issue => {
                const li = document.createElement('li');
                li.className = `issue ${issue.severity}`;
                li.innerHTML = `<h4>${issue.message}</h4><p>${issue.details}</p><div class="code-example">${issue.codeExample}</div>`;
                performanceList.appendChild(li);
            });

            interactionList.innerHTML = '';
            results.interactionIssues.forEach(issue => {
                const li = document.createElement('li');
                li.className = `issue ${issue.severity}`;
                li.innerHTML = `<h4>${issue.message}</h4><p>${issue.details}</p><div class="code-example">${issue.codeExample}</div>`;
                interactionList.appendChild(li);
            });
        }


            function generateSummary(accessibility, semantics, design, usability) {
                const summaryElement = document.getElementById('summary');
                
                // Contar problemas por categoria
                const totalIssues = accessibility.issues.length + semantics.issues.length + design.issues.length + usability.issues.length;
                const accessibilityScore = calculateScore(accessibility.issues.length);
                const semanticsScore = calculateScore(semantics.issues.length);
                const designScore = calculateScore(design.issues.length);
                const usabilityScore = calculateScore(usability.issues.length);
                
                // Criar cartões de resumo
                summaryElement.innerHTML = `
                    <div class="summary-card">
                        <h3>Acessibilidade</h3>
                        <div class="value ${accessibilityScore.class}">${accessibilityScore.score}</div>
                        <p>${accessibility.issues.length} problemas encontrados</p>
                    </div>
                    <div class="summary-card">
                        <h3>Semântica</h3>
                        <div class="value ${semanticsScore.class}">${semanticsScore.score}</div>
                        <p>${semantics.issues.length} problemas encontrados</p>
                    </div>
                    <div class="summary-card">
                        <h3>Design</h3>
                        <div class="value ${designScore.class}">${designScore.score}</div>
                        <p>${design.issues.length} problemas encontrados</p>
                    </div>
                    <div class="summary-card">
                        <h3>Usabilidade</h3>
                        <div class="value ${usabilityScore.class}">${usabilityScore.score}</div>
                        <p>${usability.issues.length} problemas encontrados</p>
                    </div>
                `;
            }

            function calculateScore(issueCount) {
                if (issueCount === 0) return { score: 'A+', class: 'good' };
                if (issueCount <= 3) return { score: 'A', class: 'good' };
                if (issueCount <= 6) return { score: 'B', class: 'warning' };
                if (issueCount <= 10) return { score: 'C', class: 'warning' };
                return { score: 'D', class: 'bad' };
            }

            function analyzeAccessibility(doc) {
                const results = {
                    contrastIssues: [],
                    formIssues: [],
                    ariaIssues: [],
                    issues: []
                };
                
                // Análise de contraste de cores
                results.contrastIssues = analyzeColorContrast(doc);
                results.issues = results.issues.concat(results.contrastIssues);
                
                // Análise de elementos de formulário
                results.formIssues = analyzeFormElements(doc);
                results.issues = results.issues.concat(results.formIssues);
                
                // Análise de atributos ARIA
                results.ariaIssues = analyzeAriaAttributes(doc);
                results.issues = results.issues.concat(results.ariaIssues);
                
                return results;
            }

            function analyzeColorContrast(doc) {
                const issues = [];
                const colorPairs = new Set();
                
                // Obter todas as combinações de cores de texto/fundo
                const elements = doc.querySelectorAll('*:not(script):not(style):not(head):not(meta):not(link)');
                
                elements.forEach(el => {
                    if (el.childNodes.length > 0) {
                        const styles = window.getComputedStyle(el);
                        const bgColor = styles.backgroundColor;
                        const textColor = styles.color;
                        
                        // Ignorar elementos transparentes ou sem texto visível
                        if (bgColor === 'rgba(0, 0, 0, 0)' || textColor === 'rgba(0, 0, 0, 0)' || 
                            bgColor === 'transparent' || styles.display === 'none' || 
                            styles.visibility === 'hidden' || styles.opacity === '0') {
                            return;
                        }
                        
                        // Criar uma chave única para o par de cores
                        const colorKey = `${textColor}-${bgColor}`;
                        
                        if (!colorPairs.has(colorKey)) {
                            colorPairs.add(colorKey);
                            
                            // Calcular contraste
                            const contrastRatio = getContrastRatio(textColor, bgColor);
                            const fontSize = parseFloat(styles.fontSize);
                            const isLargeText = fontSize >= 18 || (fontSize >= 14 && styles.fontWeight >= '700');
                            
                            // Verificar se atende aos padrões WCAG
                            const minContrast = isLargeText ? 3 : 4.5;
                            
                            if (contrastRatio < minContrast) {
                                const severity = contrastRatio < 3 ? 'bad' : 'warning';
                                const requiredContrast = isLargeText ? '3:1' : '4.5:1';
                                
                                issues.push({
                                    type: 'color-contrast',
                                    severity: severity,
                                    message: `Baixo contraste entre texto (${textColor}) e fundo (${bgColor})`,
                                    details: `Contraste medido: ${contrastRatio.toFixed(2)}:1 (requer ${requiredContrast} para ${isLargeText ? 'texto grande' : 'texto normal'})`,
                                    element: el.outerHTML.slice(0, 100) + '...',
                                    contrastRatio: contrastRatio
                                });
                            }
                        }
                    }
                });
                
                return issues;
            }

            function getContrastRatio(color1, color2) {
                const luminance1 = getLuminance(color1);
                const luminance2 = getLuminance(color2);
                
                const lighter = Math.max(luminance1, luminance2);
                const darker = Math.min(luminance1, luminance2);
                
                return (lighter + 0.05) / (darker + 0.05);
            }

            function getLuminance(color) {
                const rgb = parseColor(color);
                
                if (!rgb) return 0;
                
                const [r, g, b] = rgb.map(c => {
                    c /= 255;
                    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                });
                
                return 0.2126 * r + 0.7152 * g + 0.0722 * b;
            }

            function parseColor(color) {
                // Converter formatos de cor para RGB
                if (color.startsWith('rgb')) {
                    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
                    if (match) {
                        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
                    }
                } else if (color.startsWith('#')) {
                    const hex = color.slice(1);
                    if (hex.length === 3) {
                        return [
                            parseInt(hex[0] + hex[0], 16),
                            parseInt(hex[1] + hex[1], 16),
                            parseInt(hex[2] + hex[2], 16)
                        ];
                    } else if (hex.length === 6) {
                        return [
                            parseInt(hex.slice(0, 2), 16),
                            parseInt(hex.slice(2, 4), 16),
                            parseInt(hex.slice(4, 6), 16)
                        ];
                    }
                }
                
                return null;
            }

            function analyzeFormElements(doc) {
                const issues = [];
                
                // Verificar labels para inputs
                const inputs = doc.querySelectorAll('input:not([type="hidden"]), select, textarea');
                
                inputs.forEach(input => {
                    if (input.type !== 'hidden' && !input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
                        const id = input.id;
                        let hasLabel = false;
                        
                        if (id) {
                            hasLabel = doc.querySelector(`label[for="${id}"]`) !== null;
                        }
                        
                        if (!hasLabel) {
                            // Verificar se está dentro de um label
                            let parent = input.parentElement;
                            while (parent) {
                                if (parent.tagName === 'LABEL') {
                                    hasLabel = true;
                                    break;
                                }
                                parent = parent.parentElement;
                            }
                        }
                        
                        if (!hasLabel) {
                            issues.push({
                                type: 'form-label',
                                severity: 'bad',
                                message: 'Elemento de formulário sem label associado',
                                details: 'Todos os elementos de formulário devem ter um label associado para acessibilidade.',
                                element: input.outerHTML,
                                codeExample: `<label for="${id || 'input-id'}">Descrição:</label>\n<input type="${input.type}" id="${id || 'input-id'}">`
                            });
                        }
                    }
                });
                
                // Verificar botões sem texto descritivo
                const buttons = doc.querySelectorAll('button, [role="button"]');
                
                buttons.forEach(button => {
                    const textContent = button.textContent.trim();
                    const ariaLabel = button.getAttribute('aria-label');
                    const title = button.getAttribute('title');
                    
                    if (!textContent && !ariaLabel && !title) {
                        issues.push({
                            type: 'button-label',
                            severity: 'bad',
                            message: 'Botão sem texto descritivo ou atributo aria-label',
                            details: 'Botões devem ter texto descritivo ou um atributo aria-label para serem acessíveis.',
                            element: button.outerHTML,
                            codeExample: `<button aria-label="Descrição da ação">${textContent || 'Texto do botão'}</button>`
                        });
                    }
                });
                
                return issues;
            }

        function analyzeAriaAttributes(doc) {
            const issues = [];
            const allElements = doc.querySelectorAll('*');

            allElements.forEach(el => {
                const role = el.getAttribute('role');
                const ariaAttributes = Array.from(el.attributes)
                    .filter(attr => attr.name.startsWith('aria-'))
                    .map(attr => attr.name);

                if (ariaAttributes.length > 0) {
                    // Atributos ARIA sem role correspondente
                    if (!role) {
                        issues.push({
                            type: 'aria-misuse',
                            severity: 'warning',
                            message: 'Atributos ARIA usados sem role correspondente',
                            details: `Elemento usa ${ariaAttributes.join(', ')} mas não tem um role definido.`,
                            element: el.outerHTML.slice(0, 100) + '...',
                            codeExample: `<div role="appropriate-role" ${ariaAttributes.map(a => `${a}="value"`).join(' ')}>...</div>`
                        });
                    }

                    // Role inválido
                    if (role && !validRoles.includes(role)) {
                        issues.push({
                            type: 'invalid-role',
                            severity: 'bad',
                            message: `Role "${role}" não é um valor ARIA válido`,
                            details: 'O atributo role deve conter um valor válido da especificação ARIA.',
                            element: el.outerHTML.slice(0, 100) + '...',
                            codeExample: `<div role="valid-role">...</div>`
                        });
                    }
                }
            });

            return issues;
        }


            const validRoles = [
                'alert', 'alertdialog', 'application', 'article', 'banner', 'button', 
                'cell', 'checkbox', 'columnheader', 'combobox', 'complementary', 
                'contentinfo', 'definition', 'dialog', 'directory', 'document', 
                'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading', 
                'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main', 
                'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 
                'menuitemradio', 'navigation', 'none', 'note', 'option', 
                'presentation', 'progressbar', 'radio', 'radiogroup', 'region', 
                'row', 'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox', 
                'separator', 'slider', 'spinbutton', 'status', 'switch', 'tab', 
                'table', 'tablist', 'tabpanel', 'term', 'textbox', 'timer', 
                'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem'
            ];

            function analyzeSemantics(doc) {
                const results = {
                    semanticIssues: [],
                    headingIssues: [],
                    imageIssues: [],
                    linkIssues: [],
                    issues: []
                };
                
                // Análise de estrutura semântica
                results.semanticIssues = analyzeSemanticStructure(doc);
                results.issues = results.issues.concat(results.semanticIssues);
                
                // Análise de hierarquia de cabeçalhos
                results.headingIssues = analyzeHeadings(doc);
                results.issues = results.issues.concat(results.headingIssues);
                
                // Análise de imagens
                results.imageIssues = analyzeImages(doc);
                results.issues = results.issues.concat(results.imageIssues);
                
                // Análise de links
                results.linkIssues = analyzeLinks(doc);
                results.issues = results.issues.concat(results.linkIssues);
                
                return results;
            }

            function analyzeSemanticStructure(doc) {
                const issues = [];
                const semanticTags = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer'];
                
                // Verificar uso excessivo de divs em vez de elementos semânticos
                const divs = doc.querySelectorAll('div');
                const semanticElements = doc.querySelectorAll(semanticTags.join(','));
                
                if (divs.length > 0 && semanticElements.length === 0) {
                    issues.push({
                        type: 'semantic-structure',
                        severity: 'warning',
                        message: 'Uso excessivo de elementos div sem estrutura semântica',
                        details: `O documento contém ${divs.length} elementos div e nenhum elemento semântico (header, nav, main, etc.).`,
                        codeExample: `<header>...</header>\n<main>...</main>\n<footer>...</footer>`
                    });
                }
                
                // Verificar elementos semânticos usados incorretamente
                semanticTags.forEach(tag => {
                    const elements = doc.querySelectorAll(tag);
                    
                    elements.forEach(el => {
                        // Verificar se o elemento semântico está sendo usado de forma apropriada
                        if (tag === 'main' && doc.querySelectorAll('main').length > 1) {
                            issues.push({
                                type: 'semantic-misuse',
                                severity: 'bad',
                                message: 'Múltiplos elementos main no documento',
                                details: 'Deve haver apenas um elemento main por documento.',
                                element: el.outerHTML.slice(0, 100) + '...'
                            });
                        }
                        
                        if (tag === 'header' || tag === 'footer') {
                            let parent = el.parentElement;
                            let validParent = false;
                            
                            while (parent) {
                                if (parent.tagName === 'BODY' || 
                                    parent.tagName === 'SECTION' || 
                                    parent.tagName === 'ARTICLE' || 
                                    parent.tagName === 'ASIDE' || 
                                    parent.tagName === 'NAV') {
                                    validParent = true;
                                    break;
                                }
                                parent = parent.parentElement;
                            }
                            
                            if (!validParent) {
                                issues.push({
                                    type: 'semantic-misuse',
                                    severity: 'warning',
                                    message: `${tag} usado em contexto inadequado`,
                                    details: `${tag} deve ser filho direto de body, section, article, aside ou nav.`,
                                    element: el.outerHTML.slice(0, 100) + '...'
                                });
                            }
                        }
                    });
                });
                
                return issues;
            }

            function analyzeHeadings(doc) {
                const issues = [];
                const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
                
                // Verificar hierarquia de cabeçalhos
                let lastLevel = 0;
                
                headings.forEach((heading, index) => {
                    const level = parseInt(heading.tagName.substring(1));
                    
                    if (index === 0 && level !== 1) {
                        issues.push({
                            type: 'heading-hierarchy',
                            severity: 'warning',
                            message: 'Primeiro cabeçalho não é um h1',
                            details: 'O primeiro cabeçalho da página deve ser um h1 que descreve o conteúdo principal.',
                            element: heading.outerHTML,
                            codeExample: `<h1>Título Principal</h1>`
                        });
                    }
                    
                    if (level > lastLevel + 1) {
                        issues.push({
                            type: 'heading-hierarchy',
                            severity: 'bad',
                            message: 'Salto na hierarquia de cabeçalhos',
                            details: `Cabeçalho ${heading.tagName} segue um ${'h' + lastLevel} sem os níveis intermediários.`,
                            element: heading.outerHTML,
                            codeExample: `<h${lastLevel}>Título Anterior</h${lastLevel}>\n<h${lastLevel+1}>Sub-título</h${lastLevel+1}>`
                        });
                    }
                    
                    lastLevel = level;
                });
                
                // Verificar múltiplos h1
                const h1s = doc.querySelectorAll('h1');
                if (h1s.length > 1) {
                    issues.push({
                        type: 'multiple-h1',
                        severity: 'warning',
                        message: 'Múltiplos elementos h1 encontrados',
                        details: 'Geralmente deve haver apenas um h1 por página que descreve o conteúdo principal.',
                        codeExample: `<h1>Título Principal Único</h1>`
                    });
                }
                
                return issues;
            }

            function analyzeImages(doc) {
                const issues = [];
                const images = doc.querySelectorAll('img, [role="img"]');
                
                images.forEach(img => {
                    // Verificar imagens sem alt
                    if (img.tagName === 'IMG' && !img.hasAttribute('alt') && !img.hasAttribute('aria-hidden')) {
                        issues.push({
                            type: 'image-alt',
                            severity: 'bad',
                            message: 'Imagem sem atributo alt',
                            details: 'Todas as imagens devem ter um atributo alt que descreva seu conteúdo ou função.',
                            element: img.outerHTML,
                            codeExample: `<img src="image.jpg" alt="Descrição da imagem">`
                        });
                    }
                    
                    // Verificar alt vazio em imagens decorativas
                    if (img.tagName === 'IMG' && img.getAttribute('alt') === '' && !img.hasAttribute('role') && !img.hasAttribute('aria-hidden')) {
                        const styles = window.getComputedStyle(img);
                        if (styles.width !== '0px' && styles.height !== '0px') {
                            issues.push({
                                type: 'image-alt-empty',
                                severity: 'warning',
                                message: 'Imagem com alt vazio pode ser decorativa',
                                details: 'Imagens com alt vazio devem ser marcadas como decorativas com aria-hidden="true" ou role="presentation".',
                                element: img.outerHTML,
                                codeExample: `<img src="decorative.jpg" alt="" aria-hidden="true">`
                            });
                        }
                    }
                    
                    // Verificar imagens com texto no alt
                    if (img.tagName === 'IMG' && img.hasAttribute('alt')) {
                        const altText = img.getAttribute('alt');
                        if (altText.length > 125) {
                            issues.push({
                                type: 'image-alt-length',
                                severity: 'warning',
                                message: 'Texto alt muito longo',
                                details: 'Texto alt deve ser conciso. Para descrições longas, use aria-describedby.',
                                element: img.outerHTML,
                                codeExample: `<img src="complex-image.jpg" alt="Descrição concisa" aria-describedby="image-desc">\n<div id="image-desc">Descrição detalhada...</div>`
                            });
                        }
                    }
                });
                
                return issues;
            }

            function analyzeLinks(doc) {
                const issues = [];
                const links = doc.querySelectorAll('a[href]');
                
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    const text = link.textContent.trim();
                    const isAnchor = href.startsWith('#');
                    
                    // Verificar links sem texto descritivo
                    if (!text && !link.querySelector('img') && !link.hasAttribute('aria-label') && !link.hasAttribute('aria-labelledby')) {
                        issues.push({
                            type: 'link-text',
                            severity: 'bad',
                            message: 'Link sem texto descritivo',
                            details: 'Links devem ter texto descritivo ou um atributo aria-label para serem acessíveis.',
                            element: link.outerHTML,
                            codeExample: `<a href="${href}">Texto descritivo</a>`
                        });
                    }
                    
                    // Verificar links genéricos
                    if (text.toLowerCase() === 'clique aqui' || text.toLowerCase() === 'leia mais' || text.toLowerCase() === 'aqui') {
                        issues.push({
                            type: 'link-generic-text',
                            severity: 'warning',
                            message: 'Texto de link genérico',
                            details: 'Evite textos genéricos como "clique aqui". Use textos que descrevam o destino do link.',
                            element: link.outerHTML,
                            codeExample: `<a href="${href}">Saiba mais sobre nosso produto</a>`
                        });
                    }
                    
                    // Verificar links que abrem em nova janela sem aviso
                    if (link.getAttribute('target') === '_blank' && !link.getAttribute('aria-label') && 
                        !(link.getAttribute('title') && link.getAttribute('title').toLowerCase().includes('nova janela')) &&
                        !(text.toLowerCase().includes('nova janela'))) {
                        issues.push({
                            type: 'link-new-window',
                            severity: 'warning',
                            message: 'Link abre em nova janela sem aviso',
                            details: 'Links que abrem em nova janela devem avisar o usuário, preferencialmente no texto do link.',
                            element: link.outerHTML,
                            codeExample: `<a href="${href}" target="_blank" aria-label="Abre em nova janela">Texto do link</a>`
                        });
                    }
                    
                    // Verificar âncoras vazias
                    if (isAnchor && !text && !link.querySelector('img, svg, [aria-hidden="true"]')) {
                        issues.push({
                            type: 'empty-anchor',
                            severity: 'bad',
                            message: 'Âncora vazia',
                            details: 'Links âncora devem ter conteúdo visível ou ser marcados como decorativos.',
                            element: link.outerHTML,
                            codeExample: `<a href="${href}" aria-hidden="true"></a>`
                        });
                    }
                });
                
                return issues;
            }

            function analyzeDesign(doc) {
                const results = {
                    fontSizeIssues: [],
                    responsiveIssues: [],
                    spacingIssues: [],
                    issues: []
                };
                
                // Análise de tamanho de fontes
                results.fontSizeIssues = analyzeFontSizes(doc);
                results.issues = results.issues.concat(results.fontSizeIssues);
                
                // Análise de layout responsivo
                results.responsiveIssues = analyzeResponsiveDesign(doc);
                results.issues = results.issues.concat(results.responsiveIssues);
                
                // Análise de espaçamento e alinhamento
                results.spacingIssues = analyzeSpacing(doc);
                results.issues = results.issues.concat(results.spacingIssues);
                
                return results;
            }

            function analyzeFontSizes(doc) {
                const issues = [];
                const textElements = doc.querySelectorAll('p, span, div, li, a:not([href]), h1, h2, h3, h4, h5, h6');
                const fontSizeStats = {
                    small: 0,
                    normal: 0,
                    large: 0
                };
                
                textElements.forEach(el => {
                    const styles = window.getComputedStyle(el);
                    const fontSize = parseFloat(styles.fontSize);
                    const text = el.textContent.trim();
                    
                    if (text.length > 0 && styles.display !== 'none' && styles.visibility !== 'hidden') {
                        if (fontSize < 12) {
                            fontSizeStats.small++;
                        } else if (fontSize >= 12 && fontSize <= 18) {
                            fontSizeStats.normal++;
                        } else {
                            fontSizeStats.large++;
                        }
                        
                        // Verificar texto justificado
                        if (styles.textAlign === 'justify') {
                            issues.push({
                                type: 'text-justified',
                                severity: 'warning',
                                message: 'Texto justificado pode prejudicar a legibilidade',
                                details: 'Texto justificado pode criar "rios" de espaços em branco que dificultam a leitura.',
                                element: el.outerHTML.slice(0, 100) + '...',
                                codeExample: `<p style="text-align: left;">Texto alinhado à esquerda</p>`
                            });
                        }
                        
                        // Verificar contraste já foi feito na análise de acessibilidade
                    }
                });
                
                // Adicionar estatísticas de tamanho de fonte
                if (fontSizeStats.small > 0) {
                    issues.push({
                        type: 'font-size-small',
                        severity: 'warning',
                        message: `${fontSizeStats.small} elementos com fonte pequena (<12px)`,
                        details: 'Fontes muito pequenas podem ser difíceis de ler, especialmente para usuários com deficiência visual.',
                        codeExample: `p { font-size: 14px; }`
                    });
                }
                
                return issues;
            }

            function analyzeResponsiveDesign(doc) {
                const issues = [];
                const viewportMeta = doc.querySelector('meta[name="viewport"]');
                
                // Verificar meta viewport
                if (!viewportMeta) {
                    issues.push({
                        type: 'viewport-missing',
                        severity: 'bad',
                        message: 'Meta tag viewport ausente',
                        details: 'A meta tag viewport é essencial para design responsivo em dispositivos móveis.',
                        codeExample: `<meta name="viewport" content="width=device-width, initial-scale=1">`
                    });
                }
                
                // Verificar unidades absolutas
                const absoluteUnits = doc.querySelectorAll('[style*="px"], [style*="pt"], [style*="cm"], [style*="mm"], [style*="in"], [style*="pc"]');
                
                if (absoluteUnits.length > 10) { // Limite arbitrário
                    issues.push({
                        type: 'absolute-units',
                        severity: 'warning',
                        message: 'Uso excessivo de unidades absolutas (px, pt, etc.)',
                        details: 'Para design responsivo, prefira unidades relativas como rem, em ou %.',
                        codeExample: `div { width: 100%; font-size: 1rem; }`
                    });
                }
                
                // Verificar tabelas sem responsividade
                const tables = doc.querySelectorAll('table');
                
                tables.forEach(table => {
                    const styles = window.getComputedStyle(table);
                    if (styles.width !== 'auto' && parseFloat(styles.width) > 600) {
                        issues.push({
                            type: 'table-responsive',
                            severity: 'warning',
                            message: 'Tabela pode não ser responsiva',
                            details: 'Tabelas largas podem causar problemas em dispositivos móveis. Considere técnicas responsivas.',
                            element: table.outerHTML.slice(0, 100) + '...',
                            codeExample: `<div style="overflow-x: auto;">\n  <table>...</table>\n</div>`
                        });
                    }
                });
                
                return issues;
            }

            function analyzeSpacing(doc) {
                const issues = [];
                
                // Verificar margens e paddings excessivos
                const elements = doc.querySelectorAll('div, p, section, article, header, footer, nav');
                
                elements.forEach(el => {
                    const styles = window.getComputedStyle(el);
                    const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
                    const padding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
                    
                    if (margin > 100 || padding > 100) { // Limite arbitrário
                        issues.push({
                            type: 'excessive-spacing',
                            severity: 'warning',
                            message: 'Espaçamento vertical excessivo',
                            details: `Elemento com ${margin}px de margem e ${padding}px de padding pode criar muito espaço em branco.`,
                            element: el.outerHTML.slice(0, 100) + '...',
                            codeExample: `.element { margin: 20px 0; padding: 20px; }`
                        });
                    }
                    
                    // Verificar alinhamento de texto inconsistente
                    const textAlign = styles.textAlign;
                    const parent = el.parentElement;
                    
                    if (parent) {
                        const parentAlign = window.getComputedStyle(parent).textAlign;
                        if (textAlign && parentAlign && textAlign !== parentAlign && textAlign !== 'start') {
                            issues.push({
                                type: 'text-alignment',
                                severity: 'info',
                                message: 'Alinhamento de texto inconsistente com o elemento pai',
                                details: `Texto alinhado a ${textAlign} dentro de um elemento alinhado a ${parentAlign}.`,
                                element: el.outerHTML.slice(0, 100) + '...',
                                codeExample: `.parent { text-align: left; }\n.child { text-align: inherit; }`
                            });
                        }
                    }
                });
                
                return issues;
            }

            function analyzeUsability(doc) {
                const results = {
                    usabilityIssues: [],
                    performanceIssues: [],
                    interactionIssues: [],
                    issues: []
                };
                
                // Análise de problemas gerais de usabilidade
                results.usabilityIssues = analyzeGeneralUsability(doc);
                results.issues = results.issues.concat(results.usabilityIssues);
                
                // Análise de performance percebida
                results.performanceIssues = analyzePerformance(doc);
                results.issues = results.issues.concat(results.performanceIssues);
                
                // Análise de interatividade
                results.interactionIssues = analyzeInteractivity(doc);
                results.issues = results.issues.concat(results.interactionIssues);
                
                return results;
            }

            function analyzeGeneralUsability(doc) {
                const issues = [];
                
                // Verificar título da página
                const title = doc.querySelector('title');
                if (!title || !title.textContent.trim()) {
                    issues.push({
                        type: 'page-title',
                        severity: 'bad',
                        message: 'Página sem título',
                        details: 'O elemento <title> é essencial para SEO e usabilidade.',
                        codeExample: `<title>Descrição significativa da página</title>`
                    });
                } else if (title.textContent.trim().length > 60) {
                    issues.push({
                        type: 'page-title-length',
                        severity: 'warning',
                        message: 'Título da página muito longo',
                        details: 'Títulos devem ter até 60 caracteres para serem exibidos corretamente nos resultados de busca.',
                        element: title.outerHTML,
                        codeExample: `<title>Título conciso e descritivo</title>`
                    });
                }
                
                // Verificar favicon
                const favicon = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
                if (!favicon) {
                    issues.push({
                        type: 'favicon-missing',
                        severity: 'warning',
                        message: 'Favicon ausente',
                        details: 'Um favicon melhora a identificação do site em abas e favoritos.',
                        codeExample: `<link rel="icon" href="/favicon.ico" type="image/x-icon">`
                    });
                }
                
                // Verificar pop-ups automáticos
                const scripts = doc.querySelectorAll('script');
                scripts.forEach(script => {
                    const scriptText = script.textContent;
                    if (scriptText.includes('alert(') || 
                        scriptText.includes('confirm(') || 
                        scriptText.includes('prompt(') ||
                        scriptText.includes('.open(') ||
                        scriptText.includes('.showModal(')) {
                        issues.push({
                            type: 'popup-detected',
                            severity: 'bad',
                            message: 'Possível pop-up automático detectado',
                            details: 'Pop-ups automáticos podem prejudicar a experiência do usuário.',
                            element: script.outerHTML.slice(0, 100) + '...',
                            codeExample: `// Evite:\nwindow.onload = function() { alert('Bem-vindo!'); };`
                        });
                    }
                });
                
                return issues;
            }

            function analyzePerformance(doc) {
                const issues = [];
                
                // Verificar imagens grandes
                const images = doc.querySelectorAll('img');
                images.forEach(img => {
                    const width = img.getAttribute('width');
                    const height = img.getAttribute('height');
                    
                    if (width && height) {
                        const area = parseInt(width) * parseInt(height);
                        if (area > 1000000) { // 1 megapixel
                            issues.push({
                                type: 'large-image',
                                severity: 'warning',
                                message: 'Imagem potencialmente muito grande',
                                details: `Imagem com dimensões ${width}x${height} pixels pode afetar o desempenho. Considere otimizar.`,
                                element: img.outerHTML.slice(0, 100) + '...',
                                codeExample: `<img src="image.jpg" width="800" height="600" loading="lazy" alt="...">`
                            });
                        }
                    }
                });
                
                // Verificar scripts bloqueantes
                const headScripts = doc.querySelectorAll('head script:not([async]):not([defer])');
                if (headScripts.length > 0) {
                    issues.push({
                        type: 'blocking-scripts',
                        severity: 'warning',
                        message: 'Scripts bloqueantes no head',
                        details: 'Scripts no head sem async/defer podem atrasar a renderização da página.',
                        codeExample: `<script src="app.js" defer></script>`
                    });
                }

                return issues;
            }

            function analyzeInteractivity(doc) {
                const issues = [];
                // (Você pode adicionar lógica adicional aqui se desejar)
                return issues;
            }

            return results;
        }
    );
