const ColorPalette = {
    red: '#ff6b6b',
    green: '#51cf66',
    blue: '#339af0',
    yellow: '#fcc419',
    purple: '#cc5de8',
    orange: '#ff922b'
};

const QuizUI = {
    createQuestionContainer() {
        const qContainer = document.createElement('div');
        qContainer.className = 'question-container';
        qContainer.style.display = 'flex';
        qContainer.style.flexDirection = 'column';
        qContainer.style.height = '70vh';
        qContainer.style.minHeight = '25rem';
        qContainer.style.marginBottom = '1.25rem';
        qContainer.style.padding = '1rem';
        qContainer.style.border = '0.0625rem solid #444';
        qContainer.style.borderRadius = '0.5rem';
        qContainer.style.boxSizing = 'border-box';
        qContainer.style.backgroundColor = '#252525';
        qContainer.style.textShadow = '0.0625rem 0.0625rem 0.0625rem rgba(0,0,0,0.5)';
        return qContainer;
    },

    createSubmitButton() {
        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Submit';
        submitBtn.style.padding = '0.625rem 1.25rem';
        submitBtn.style.fontSize = '1rem';
        submitBtn.style.cursor = 'pointer';
        submitBtn.style.width = '100%';
        submitBtn.style.marginTop = 'auto';
        return submitBtn;
    },

    createQuestionPrompt(text) {
        const prompt = document.createElement('h3');
        prompt.textContent = text;
        prompt.style.margin = '0 0 0.625rem 0';
        prompt.style.fontSize = '1.25rem';
        return prompt;
    },

    createQuestionBody(content) {
        const body = document.createElement('div');
        if (typeof content === 'string') {
            body.textContent = content;
        } else if (content instanceof HTMLElement) {
            body.appendChild(content);
        }
        body.style.margin = '0 0 0.625rem 0';
        body.style.fontSize = '1.1rem';
        return body;
    },

    createMathExpression(parts) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.gap = '0.3rem';
        container.style.fontSize = '1.5rem';
        
        parts.forEach(part => {
            const span = document.createElement('span');
            span.textContent = part.text;
            if (part.color) {
                span.style.color = ColorPalette[part.color] || part.color;
                span.style.fontWeight = 'bold';
            }
            container.appendChild(span);
        });
        return container;
    },

    createT9Keypad(onKeyClick) {
        const container = document.createElement('div');
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(3, 1fr)';
        container.style.gridTemplateRows = 'repeat(4, 1fr)';
        container.style.gap = '0.5rem';
        container.style.height = '100%';
        container.style.width = '100%';
        container.style.boxSizing = 'border-box';

        const keys = [
            { main: '1', sub: ' ' }, { main: '2', sub: 'ABC' }, { main: '3', sub: 'DEF' },
            { main: '4', sub: 'GHI' }, { main: '5', sub: 'JKL' }, { main: '6', sub: 'MNO' },
            { main: '7', sub: 'PQRS' }, { main: '8', sub: 'TUV' }, { main: '9', sub: 'WXYZ' },
            { main: '*', sub: '' }, { main: '0', sub: '_' }, { main: '⌫', sub: '' }
        ];

        keys.forEach(key => {
            const btn = document.createElement('button');
            btn.style.display = 'flex';
            btn.style.flexDirection = 'column';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.borderRadius = '0.5rem';
            btn.style.border = '0.0625rem solid #444';
            btn.style.backgroundColor = '#2c2c2c';
            btn.style.color = '#e0e0e0';
            btn.style.cursor = 'pointer';
            btn.style.userSelect = 'none';
            btn.style.padding = '0';

            const mainSpan = document.createElement('span');
            mainSpan.textContent = key.main;
            mainSpan.style.fontWeight = 'bold';
            mainSpan.style.fontSize = '1.2rem';
            btn.appendChild(mainSpan);

            if (key.sub) {
                const subSpan = document.createElement('span');
                subSpan.textContent = key.sub;
                subSpan.style.fontSize = '0.6rem';
                subSpan.style.color = '#999';
                btn.appendChild(subSpan);
            }

            btn.onclick = (e) => {
                e.preventDefault();
                onKeyClick(key.main);
            };
            container.appendChild(btn);
        });

        return container;
    },

    createT9Display() {
        const display = document.createElement('div');
        display.style.width = '100%';
        display.style.padding = '0.5rem';
        display.style.fontSize = '1.5rem';
        display.style.border = '0.0625rem solid #444';
        display.style.borderRadius = '0.25rem';
        display.style.marginBottom = '0.5rem';
        display.style.minHeight = '2.5rem';
        display.style.display = 'flex';
        display.style.alignItems = 'center';
        display.style.justifyContent = 'center';
        display.style.boxSizing = 'border-box';
        display.style.backgroundColor = '#1a1a1a';
        display.style.color = '#e0e0e0';
        return display;
    }
};

class ShortAnswer {
    constructor() {
        this.value = '';
        this.display = QuizUI.createT9Display();
        this.keypad = QuizUI.createT9Keypad((key) => this.handleInput(key));
        
        this.container = document.createElement('div');
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.height = '100%';
        this.container.appendChild(this.display);
        
        this.keypad.style.flex = '1';
        this.container.appendChild(this.keypad);
    }

    handleInput(key) {
        if (key === '⌫') {
            this.value = this.value.slice(0, -1);
        } else if (key === '*' || key === '#') {
            // No action for now
        } else {
            this.value += key;
        }
        this.display.textContent = this.value;
    }

    render() {
        return this.container;
    }

    getAnswer() {
        return this.value;
    }
}

class TimedResponse {
    constructor(value, delay = 1000) {
        this.value = value;
        this.delay = delay;
        this.container = document.createElement('div');
    }

    render() {
        return this.container;
    }

    getAnswer() {
        return this.value;
    }
}

class ReadyResponse {
    constructor() {
        this.container = document.createElement('div');
        this.buttonText = 'Ready';
    }

    render() {
        return this.container;
    }

    getAnswer() {
        return "";
    }
}

class Question {
    constructor(prompt, body, correctAnswer, response, validator) {
        this.prompt = prompt; // HTMLElement
        this.body = body; // HTMLElement
        this.correctAnswer = correctAnswer;
        this.response = response; // ShortAnswer
        this.validator = validator; // (answer: string, ctx: any) => bool
    }
}

class TimedQuestion {
    constructor(prompt, body, value, delay = 1000) {
        this.prompt = prompt;
        this.body = body;
        this.response = new TimedResponse(value, delay);
        this.validator = (answer, ctx) => {
            if (!ctx.sequence) ctx.sequence = [];
            ctx.sequence.push(answer);
            return true;
        };
    }
}

class ReadyQuestion {
    constructor(prompt, body) {
        this.prompt = prompt;
        this.body = body;
        this.response = new ReadyResponse();
        this.validator = () => true;
    }
}

function initQuiz(iterator, ctx, submit) {
    const app = document.getElementById('app');
    if (!app) {
        console.error("No element with id 'app' found");
        return;
    }

    let currentTimeout = null;

    const renderCurrentQuestion = (q) => {
        if (currentTimeout) {
            clearTimeout(currentTimeout);
            currentTimeout = null;
        }

        app.innerHTML = '';
        if (!q) {
            submit(ctx);
            return;
        }
        const qContainer = QuizUI.createQuestionContainer();

        const topHalf = document.createElement('div');
        topHalf.style.height = '50%';
        topHalf.style.display = 'flex';
        topHalf.style.flexDirection = 'column';
        topHalf.style.justifyContent = 'center';
        topHalf.style.textAlign = 'center';
        topHalf.style.boxSizing = 'border-box';
        topHalf.style.padding = '0.5rem';

        topHalf.appendChild(q.prompt);
        topHalf.appendChild(q.body);
        qContainer.appendChild(topHalf);
        
        const bottomHalf = document.createElement('div');
        bottomHalf.style.height = '50%';
        bottomHalf.style.boxSizing = 'border-box';
        bottomHalf.style.padding = '0.5rem';

        const responseEl = q.response.render();
        responseEl.style.height = '100%';
        bottomHalf.appendChild(responseEl);
        qContainer.appendChild(bottomHalf);

        app.appendChild(qContainer);

        const handleNext = (forcedResult) => {
            if (currentTimeout) {
                clearTimeout(currentTimeout);
                currentTimeout = null;
            }
            const answer = q.response.getAnswer();
            q.validator(answer, ctx, forcedResult);
            renderCurrentQuestion(iterator.next(ctx));
        };

        if (window.isDevMode && !q.response.delay) {
            const btnContainer = document.createElement('div');
            btnContainer.style.display = 'flex';
            btnContainer.style.gap = '0.5rem';
            btnContainer.style.width = '100%';
            btnContainer.style.marginTop = 'auto';

            const correctBtn = QuizUI.createSubmitButton();
            correctBtn.textContent = 'Correct';
            correctBtn.style.backgroundColor = '#27ae60';
            correctBtn.style.flex = '1';
            correctBtn.onclick = () => handleNext(true);

            const submitBtn = QuizUI.createSubmitButton();
            if (q.response.buttonText) {
                submitBtn.textContent = q.response.buttonText;
            }
            submitBtn.style.flex = '1';
            submitBtn.onclick = () => handleNext();

            const incorrectBtn = QuizUI.createSubmitButton();
            incorrectBtn.textContent = 'Incorrect';
            incorrectBtn.style.backgroundColor = '#e74c3c';
            incorrectBtn.style.flex = '1';
            incorrectBtn.onclick = () => handleNext(false);

            btnContainer.appendChild(correctBtn);
            btnContainer.appendChild(submitBtn);
            btnContainer.appendChild(incorrectBtn);
            app.appendChild(btnContainer);
        } else {
            const submitBtn = QuizUI.createSubmitButton();
            if (q.response.buttonText) {
                submitBtn.textContent = q.response.buttonText;
            }
            submitBtn.onclick = () => handleNext();
            app.appendChild(submitBtn);

            if (q.response.delay) {
                submitBtn.style.display = 'none';
                currentTimeout = setTimeout(() => handleNext(), q.response.delay);
            }
        }
    };

    renderCurrentQuestion(iterator.next(ctx));
}

// Consumer implementation: Phase-based arithmetic questions
function createArithmeticQuestions() {
    const getRandomOp = () => Math.random() > 0.5 ? '+' : '∙';
    const getRandomVal = () => Math.floor(Math.random() * 3) + 2;
    const applyRule = (val, rule) => rule.op === '+' ? val + rule.val : val * rule.val;
    const calculate = (nums, operators) => {
        let currentNums = [...nums];
        let currentOps = [...operators];
        for (let i = 0; i < currentOps.length; i++) {
            if (currentOps[i] === '∙') {
                const res = currentNums[i] * currentNums[i+1];
                currentNums.splice(i, 2, res);
                currentOps.splice(i, 1);
                i--;
            }
        }
        let total = currentNums[0];
        for (let i = 0; i < currentOps.length; i++) {
            total += currentNums[i+1];
        }
        return total;
    };

    return {
        next(ctx) {
            if (ctx.phase === undefined) {
                ctx.phase = 1;
                ctx.readyStarted = false;
                ctx.stimuliShown = 0;
                ctx.questionsDone = 0;
                ctx.stimuli = [];
                ctx.rulePool = [];
                ctx.stimuliByPhase = {};
                ctx.availableRules = [];
            }

            if (ctx.phase > 6) {
                return null;
            }

            const totalIncorrect = ctx.results.filter(r => !r.correct).length;
            if (totalIncorrect >= 5) {
                return null;
            }

            // Phase start: Ready
            if (!ctx.readyStarted) {
                ctx.readyStarted = true;
                const prompt = QuizUI.createQuestionPrompt(`Phase ${ctx.phase}`);
                const body = QuizUI.createQuestionBody("Ready to see the color sequence?");
                return new ReadyQuestion(prompt, body);
            }

            // Sub-phase 1: Stimuli
            if (ctx.stimuliShown < ctx.phase) {
                if (!ctx.availableRules || ctx.availableRules.length === 0) {
                    const allRules = [
                        { op: '+', val: 2 }, { op: '+', val: 3 }, { op: '+', val: 4 },
                        { op: '∙', val: 2 }, { op: '∙', val: 3 }, { op: '∙', val: 4 }
                    ];
                    ctx.availableRules = allRules.sort(() => Math.random() - 0.5);
                }

                const colors = ["red", "green", "blue", "yellow", "purple", "orange"];
                const usedColors = ctx.stimuli.map(s => s.color);
                const availableColors = colors.filter(c => !usedColors.includes(c));
                
                const color = availableColors[Math.floor(Math.random() * availableColors.length)];
                
                const rule = ctx.availableRules.pop();
                const stimulus = { color, op: rule.op, val: rule.val };
                ctx.stimuli.push(stimulus);
                ctx.stimuliByPhase[ctx.phase] = ctx.stimuli;
                ctx.stimuliShown++;

                const prompt = QuizUI.createQuestionPrompt(`Phase ${ctx.phase}: Remember`);
                const body = QuizUI.createQuestionBody(`${color} ${rule.op} ${rule.val}`);
                body.style.color = ColorPalette[color] || color;
                body.style.fontWeight = 'bold';
                body.style.fontSize = '2rem';
                body.style.textAlign = 'center';

                return new TimedQuestion(prompt, body, stimulus, 3000);
            }

            // Sub-phase 2: Questions
            if (ctx.questionsDone < 12) {
                if (ctx.rulePool.length === 0 && ctx.questionsDone === 0) {
                    for (let i = 0; i < 12; i++) {
                        ctx.rulePool.push(ctx.stimuli[i % ctx.stimuli.length]);
                    }
                }

                const phase = ctx.phase;
                const numOperators = 1;
                const numOperands = numOperators + 1;
                
                const operands = [];
                for (let i = 0; i < numOperands; i++) {
                    operands.push(getRandomVal());
                }
                
                const ops = [];
                for (let i = 0; i < numOperators; i++) {
                    ops.push(getRandomOp());
                }

                const coloredIndex = Math.floor(Math.random() * numOperands);
                const poolIndex = Math.floor(Math.random() * ctx.rulePool.length);
                const stimulus = ctx.rulePool.splice(poolIndex, 1)[0];
                
                const parts = [];
                for (let i = 0; i < numOperands; i++) {
                    parts.push({ 
                        text: operands[i].toString(), 
                        color: i === coloredIndex ? stimulus.color : null 
                    });
                    if (i < numOperators) {
                        parts.push({ text: ` ${ops[i]} ` });
                    }
                }

                const realOperands = [...operands];
                realOperands[coloredIndex] = applyRule(operands[coloredIndex], stimulus);

                const correctAnswer = calculate(realOperands, ops);
                const prompt = QuizUI.createQuestionPrompt(`Phase ${ctx.phase}: Question ${ctx.questionsDone + 1}`);
                const body = QuizUI.createQuestionBody(QuizUI.createMathExpression(parts));

                const response = new ShortAnswer();

                const currentQNumber = ctx.results.length + 1;
                const questionParts = JSON.parse(JSON.stringify(parts));
                ctx.questionStartTime = Date.now();
                const validator = (answer, ctx, forcedResult) => {
                    const duration = Date.now() - ctx.questionStartTime;
                    const isCorrect = forcedResult !== undefined ? forcedResult : (answer.trim() === correctAnswer.toString());
                    ctx.results.push({
                        phase: phase,
                        numOperators: numOperators,
                        duration: duration,
                        question: currentQNumber,
                        correct: isCorrect,
                        userAnswer: forcedResult === true ? correctAnswer.toString() : answer,
                        correctAnswer: correctAnswer.toString(),
                        parts: questionParts
                    });
                    return isCorrect;
                };

                ctx.questionsDone++;
                return new Question(prompt, body, correctAnswer.toString(), response, validator);
            }

            // Next phase
            ctx.phase++;
            ctx.readyStarted = false;
            ctx.stimuliShown = 0;
            ctx.questionsDone = 0;
            ctx.stimuli = [];
            ctx.rulePool = [];
            ctx.availableRules = [];
            return this.next(ctx);
        }
    };
}

// Bootstrap the app
window.addEventListener('load', () => {
    const startApp = () => {
        const ctx = {
            results: [],
            startTime: Date.now()
        };

        const iterator = createArithmeticQuestions();

        const handleSubmit = (finalCtx) => {
            const duration = Math.round((Date.now() - finalCtx.startTime) / 1000);
            
            let aggregateScore = 0;
            finalCtx.results.forEach(r => {
                if (r.correct) {
                    aggregateScore += (r.phase / 12.0);
                }
            });
            console.log("Aggregate Score:", aggregateScore);

            const phases = finalCtx.results.map(r => r.phase);
            const lastPhase = phases.length > 0 ? Math.max(...phases) : 1;
            const lastPhaseResults = finalCtx.results.filter(r => r.phase === lastPhase);
            //
            // console.log("lastPhase:", lastPhase);
            //
            // let divisor = 0;
            // for (let i = 1; i < lastPhase; i++) {
            //     divisor += 1;
            // }
            // console.log("base divisor:", divisor);
            // divisor += (lastPhaseResults.filter(r => r.correct).length / 12);
            // console.log("final divisor:", divisor);

            const finalScore = (lastPhase - 1) + (lastPhaseResults.filter(r => r.correct).length / 12);

            const resultsByPhase = {};
            finalCtx.results.forEach(r => {
                if (!resultsByPhase[r.phase]) resultsByPhase[r.phase] = [];
                resultsByPhase[r.phase].push(r);
            });

            let historyHtml = `
                <div style="margin-top: 2rem; text-align: left; max-width: 40rem; margin-left: auto; margin-right: auto; border-top: 0.125rem solid #333; padding-top: 1.25rem; text-shadow: 0.0625rem 0.0625rem 0.0625rem rgba(0,0,0,0.5);">
                    <h3 style="text-align: center; margin-bottom: 1.25rem;">Answer Key</h3>
            `;

            Object.keys(resultsByPhase).sort((a, b) => a - b).forEach(phaseStr => {
                const phaseNum = parseInt(phaseStr);
                const phaseResults = resultsByPhase[phaseStr];
                const stimuli = finalCtx.stimuliByPhase[phaseNum] || [];

                historyHtml += `
                    <div style="margin-bottom: 2rem;">
                        <h4 style="border-bottom: 1px solid #444; padding-bottom: 0.3rem; margin-bottom: 0.6rem;">Phase ${phaseNum}</h4>
                        <div style="margin-bottom: 0.8rem; font-size: 0.95rem;">
                            <strong>Rules:</strong> 
                            ${stimuli.map(s => `<span style="color: ${ColorPalette[s.color] || s.color}; font-weight: bold; margin-right: 0.8rem;">${s.color} ${s.op} ${s.val}</span>`).join('')}
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.9rem;">
                `;

                phaseResults.forEach((r, idx) => {
                    const qDisplay = r.parts.map(p => {
                        if (p.color) return `<span style="color: ${ColorPalette[p.color] || p.color}; font-weight: bold;">${p.text}</span>`;
                        return p.text;
                    }).join('');

                    const statusIcon = r.correct 
                        ? '<span style="color: #4CAF50; font-weight: bold; margin-right: 0.5rem;">✓</span>' 
                        : '<span style="color: #f44336; font-weight: bold; margin-right: 0.5rem;">✗</span>';
                    
                    const responseInfo = r.correct 
                        ? `<span style="color: #aaa;">Answer: ${r.userAnswer}</span>`
                        : `<span style="color: #aaa;">Got: <span style="text-decoration: line-through;">${r.userAnswer || 'none'}</span>, Expected: ${r.correctAnswer}</span>`;

                    historyHtml += `
                        <div style="display: flex; align-items: baseline; border-bottom: 1px dashed #333; padding-bottom: 0.2rem;">
                            ${statusIcon}
                            <div style="flex: 1;">
                                Q${idx + 1}: ${qDisplay} = ${r.correctAnswer}
                            </div>
                            <div style="margin-left: 1rem;">
                                ${responseInfo}
                            </div>
                        </div>
                    `;
                });

                historyHtml += `</div></div>`;
            });

            historyHtml += `</div>`;

            const app = document.getElementById('app');
            app.innerHTML = `
                <div style="text-align: center; padding: 1.25rem; border: 0.125rem solid #81c784; border-radius: 0.625rem;">
                    <h2 style="font-size: 1.5rem;">Quiz Over!</h2>
                    <p style="font-size: 2rem; font-weight: bold; margin: 1rem 0;">Score: ${finalScore.toFixed(2)}</p>
                    <p style="font-size: 1.1rem;">Total Time: ${duration} seconds</p>
                    ${historyHtml}
                    <button id="retry-btn" style="padding: 0.625rem 1.25rem; cursor: pointer; font-size: 1rem; margin-top: 1.25rem;">Try Again</button>
                </div>
            `;
            document.getElementById('retry-btn').onclick = startApp;
        };

        initQuiz(iterator, ctx, handleSubmit);
    };

    startApp();

    // Dev Mode Setup
    (function() {
        const devModeContainer = document.createElement('div');
        devModeContainer.style.position = 'fixed';
        devModeContainer.style.bottom = '1rem';
        devModeContainer.style.right = '1rem';
        devModeContainer.style.padding = '0.5rem';
        devModeContainer.style.backgroundColor = '#1e1e1e';
        devModeContainer.style.color = '#e0e0e0';
        devModeContainer.style.border = '1px solid #444';
        devModeContainer.style.borderRadius = '0.25rem';
        devModeContainer.style.zIndex = '9999';
        devModeContainer.style.display = 'flex';
        devModeContainer.style.alignItems = 'center';
        devModeContainer.style.gap = '0.5rem';
        devModeContainer.style.fontSize = '0.8rem';
        devModeContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'dev-mode-toggle';
        
        const label = document.createElement('label');
        label.htmlFor = 'dev-mode-toggle';
        label.textContent = 'Dev Mode';
        label.style.cursor = 'pointer';

        devModeContainer.appendChild(checkbox);
        devModeContainer.appendChild(label);
        document.body.appendChild(devModeContainer);

        window.isDevMode = false;
        checkbox.onchange = (e) => {
            window.isDevMode = e.target.checked;
        };
    })();
});
