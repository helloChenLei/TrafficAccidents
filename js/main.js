/**
 * 交通事故赔偿计算工具 - 主JS文件
 * 处理用户交互、表单验证和结果展示
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化地区数据
    initRegionData();
    
    // 绑定步骤导航事件
    bindStepNavigation();
    
    // 绑定表单联动事件
    bindFormInteractions();
    
    // 绑定计算按钮事件
    bindCalculateButton();
    
    // 绑定导出PDF按钮事件
    bindExportButton();
});

// 初始化地区数据
function initRegionData() {
    const provinceSelect = document.getElementById('location');
    const citySelect = document.getElementById('city');
    
    // 清空现有选项
    provinceSelect.innerHTML = '<option value="">请选择省份</option>';
    
    // 添加省份选项
    compensationData.regionData.provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province.code;
        option.textContent = province.name;
        provinceSelect.appendChild(option);
    });
    
    // 省份变化时更新城市选项
    provinceSelect.addEventListener('change', function() {
        const provinceCode = this.value;
        updateCities(provinceCode);
    });
}

// 更新城市选项
function updateCities(provinceCode) {
    const citySelect = document.getElementById('city');
    
    // 清空现有选项
    citySelect.innerHTML = '<option value="">请选择城市</option>';
    
    if (!provinceCode) return;
    
    // 查找对应省份的城市列表
    const province = compensationData.regionData.provinces.find(p => p.code === provinceCode);
    if (!province) return;
    
    // 添加城市选项
    province.cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.code;
        option.textContent = city.name;
        citySelect.appendChild(option);
    });
}

// 绑定步骤导航事件
function bindStepNavigation() {
    const steps = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    
    // 点击步骤导航
    steps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = parseInt(this.getAttribute('data-step'));
            if (validatePreviousSteps(stepNumber)) {
                goToStep(stepNumber);
            }
        });
    });
    
    // 下一步按钮
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.closest('.form-step').id.split('-')[1]);
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        });
    });
    
    // 上一步按钮
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.closest('.form-step').id.split('-')[1]);
            goToStep(currentStep - 1);
        });
    });
    
    // 重新计算按钮
    document.querySelector('.recalculate-btn').addEventListener('click', function() {
        goToStep(1);
    });
}

// 跳转到指定步骤
function goToStep(stepNumber) {
    const steps = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');
    
    // 更新步骤导航样式
    steps.forEach(step => {
        const stepNum = parseInt(step.getAttribute('data-step'));
        step.classList.remove('active');
        if (stepNum < stepNumber) {
            step.classList.add('completed');
        } else if (stepNum === stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('completed');
        }
    });
    
    // 显示当前步骤表单
    formSteps.forEach(formStep => {
        formStep.style.display = 'none';
    });
    document.getElementById(`step-${stepNumber}`).style.display = 'block';
    
    // 滚动到顶部
    window.scrollTo(0, 0);
}

// 验证当前步骤
function validateStep(stepNumber) {
    const stepForm = document.getElementById(`step-${stepNumber}`);
    const requiredFields = stepForm.querySelectorAll('[required]:not([style*="display: none"])');
    
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value) {
            isValid = false;
            field.classList.add('error');
            
            // 添加错误提示
            let errorMsg = field.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                errorMsg = document.createElement('div');
                errorMsg.classList.add('error-message');
                errorMsg.textContent = '此字段为必填项';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
        } else {
            field.classList.remove('error');
            
            // 移除错误提示
            const errorMsg = field.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        }
    });
    
    return isValid;
}

// 验证之前的所有步骤
function validatePreviousSteps(stepNumber) {
    let isValid = true;
    
    for (let i = 1; i < stepNumber; i++) {
        if (!validateStep(i)) {
            goToStep(i);
            isValid = false;
            break;
        }
    }
    
    return isValid;
}

// 绑定表单联动事件
function bindFormInteractions() {
    // 收入类型联动
    const incomeTypeSelect = document.getElementById('income-type');
    incomeTypeSelect.addEventListener('change', function() {
        const fixedIncomeFields = document.querySelector('.fixed-income');
        const nonFixedIncomeFields = document.querySelector('.non-fixed-income');
        
        if (this.value === 'fixed') {
            fixedIncomeFields.style.display = 'block';
            nonFixedIncomeFields.style.display = 'none';
        } else if (this.value === 'non-fixed') {
            fixedIncomeFields.style.display = 'none';
            nonFixedIncomeFields.style.display = 'block';
        } else {
            fixedIncomeFields.style.display = 'none';
            nonFixedIncomeFields.style.display = 'none';
        }
    });
    
    // 伤害类型联动
    const injuryTypeSelect = document.getElementById('injury-type');
    injuryTypeSelect.addEventListener('change', function() {
        const injuryFields = document.getElementById('injury-fields');
        const disabilityFields = document.getElementById('disability-fields');
        const deathFields = document.getElementById('death-fields');
        
        injuryFields.style.display = 'none';
        disabilityFields.style.display = 'none';
        deathFields.style.display = 'none';
        
        if (this.value === 'injury') {
            injuryFields.style.display = 'block';
        } else if (this.value === 'disability') {
            injuryFields.style.display = 'block';
            disabilityFields.style.display = 'block';
        } else if (this.value === 'death') {
            deathFields.style.display = 'block';
        }
    });
    
    // 护理需求联动
    const nursingCareSelect = document.getElementById('nursing-care');
    nursingCareSelect.addEventListener('change', function() {
        const nursingFields = document.getElementById('nursing-fields');
        
        if (this.value === 'yes') {
            nursingFields.style.display = 'block';
        } else {
            nursingFields.style.display = 'none';
        }
    });
    
    // 经营性车辆联动
    const businessVehicleSelect = document.getElementById('business-vehicle');
    businessVehicleSelect.addEventListener('change', function() {
        const businessLossFields = document.getElementById('business-loss-fields');
        
        if (this.value === 'yes') {
            businessLossFields.style.display = 'block';
        } else {
            businessLossFields.style.display = 'none';
        }
    });
}

// 绑定计算按钮事件
function bindCalculateButton() {
    const calculateButton = document.querySelector('.calculate-btn');
    
    calculateButton.addEventListener('click', function() {
        if (validatePreviousSteps(6) && validateStep(6)) {
            const formData = collectFormData();
            calculateCompensation(formData);
            goToStep(7);
        }
    });
}

// 收集表单数据
function collectFormData() {
    const form = document.getElementById('compensation-form');
    const formData = {};
    
    // 基础信息
    formData.responsibility = document.getElementById('responsibility').value;
    formData.location = document.getElementById('location').value;
    formData.city = document.getElementById('city').value;
    
    // 受害人信息
    formData.age = parseInt(document.getElementById('age').value) || 0;
    formData.household = document.getElementById('household').value;
    formData.incomeType = document.getElementById('income-type').value;
    
    if (formData.incomeType === 'fixed') {
        formData.companyName = document.getElementById('company-name').value;
        formData.monthlyIncome = parseFloat(document.getElementById('monthly-income').value) || 0;
    } else if (formData.incomeType === 'non-fixed') {
        formData.averageIncome = parseFloat(document.getElementById('average-income').value) || 0;
    }
    
    // 伤害情况
    formData.injuryType = document.getElementById('injury-type').value;
    
    if (formData.injuryType === 'injury' || formData.injuryType === 'disability') {
        formData.medicalExpenses = parseFloat(document.getElementById('medical-expenses').value) || 0;
        formData.hospitalDays = parseInt(document.getElementById('hospital-days').value) || 0;
        formData.workOffDays = parseInt(document.getElementById('work-off-days').value) || 0;
    }
    
    if (formData.injuryType === 'disability') {
        formData.disabilityLevel = document.getElementById('disability-level').value;
    }
    
    if (formData.injuryType === 'death') {
        formData.dependents = parseInt(document.getElementById('dependents').value) || 0;
    }
    
    // 护理情况
    formData.nursingCare = document.getElementById('nursing-care').value;
    
    if (formData.nursingCare === 'yes') {
        formData.nursingDays = parseInt(document.getElementById('nursing-days').value) || 0;
        formData.nurseHasIncome = document.getElementById('nurse-has-income').value;
    }
    
    // 交通住宿
    formData.transportationFee = parseFloat(document.getElementById('transportation-fee').value) || 0;
    formData.accommodationFee = parseFloat(document.getElementById('accommodation-fee').value) || 0;
    formData.accompanies = parseInt(document.getElementById('accompanies').value) || 0;
    
    // 财产损失
    formData.vehicleRepair = parseFloat(document.getElementById('vehicle-repair').value) || 0;
    formData.propertyLoss = parseFloat(document.getElementById('property-loss').value) || 0;
    formData.rescueCost = parseFloat(document.getElementById('rescue-cost').value) || 0;
    formData.businessVehicle = document.getElementById('business-vehicle').value;
    
    if (formData.businessVehicle === 'yes') {
        formData.businessLoss = parseFloat(document.getElementById('business-loss').value) || 0;
        formData.businessDays = parseInt(document.getElementById('business-days').value) || 0;
    }
    
    // 其他费用
    formData.mentalDamage = parseFloat(document.getElementById('mental-damage').value) || 0;
    formData.appraisalFee = parseFloat(document.getElementById('appraisal-fee').value) || 0;
    formData.litigationFee = parseFloat(document.getElementById('litigation-fee').value) || 0;
    
    return formData;
}

// 计算赔偿金额
function calculateCompensation(formData) {
    // 创建计算器实例
    const calculator = new CompensationCalculator(formData, compensationData);
    
    // 计算赔偿金额
    const results = calculator.calculateTotalCompensation();
    
    // 显示结果
    displayResults(results, formData);
}

// 显示计算结果
function displayResults(results, formData) {
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = '';
    
    // 责任信息
    const responsibilityText = {
        'full': '全责 (100%)',
        'main': '主责 (75%)',
        'minor': '次责 (35%)',
        'none': '无责 (0%)'
    };
    
    // 添加责任信息
    const responsibilityInfo = document.createElement('div');
    responsibilityInfo.className = 'result-info';
    responsibilityInfo.innerHTML = `
        <p><strong>责任类型:</strong> ${responsibilityText[formData.responsibility]}</p>
        <p><strong>赔偿比例:</strong> ${(results.responsibilityRatio * 100).toFixed(0)}%</p>
    `;
    resultContainer.appendChild(responsibilityInfo);
    
    // 添加分割线
    const divider = document.createElement('hr');
    resultContainer.appendChild(divider);
    
    // 添加各项赔偿明细
    const resultItems = [
        { key: 'medicalExpenses', label: '医疗费' },
        { key: 'workOffCompensation', label: '误工费' },
        { key: 'nursingCare', label: '护理费' },
        { key: 'transportationFee', label: '交通费' },
        { key: 'accommodationFee', label: '住宿费' },
        { key: 'foodAllowance', label: '伙食补助费' },
        { key: 'nutritionFee', label: '营养费' },
        { key: 'disabilityCompensation', label: '残疾赔偿金' },
        { key: 'deathCompensation', label: '死亡赔偿金' },
        { key: 'funeralExpenses', label: '丧葬费' },
        { key: 'dependentsLivingExpenses', label: '被扶养人生活费' },
        { key: 'propertyLoss', label: '财产损失' },
        { key: 'mentalDamage', label: '精神损害赔偿' },
        { key: 'legalFees', label: '鉴定费和诉讼费' }
    ];
    
    // 创建结果表格
    const resultTable = document.createElement('table');
    resultTable.className = 'result-table';
    
    // 添加表头
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
        <tr>
            <th>赔偿项目</th>
            <th>金额 (元)</th>
        </tr>
    `;
    resultTable.appendChild(tableHeader);
    
    // 添加表体
    const tableBody = document.createElement('tbody');
    
    // 添加各项赔偿
    resultItems.forEach(item => {
        if (results[item.key] > 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.label}</td>
                <td>${formatCurrency(results[item.key])}</td>
            `;
            tableBody.appendChild(row);
        }
    });
    
    // 添加小计行
    const subtotalRow = document.createElement('tr');
    subtotalRow.className = 'subtotal-row';
    subtotalRow.innerHTML = `
        <td>小计</td>
        <td>${formatCurrency(results.total)}</td>
    `;
    tableBody.appendChild(subtotalRow);
    
    // 添加责任比例行
    const ratioRow = document.createElement('tr');
    ratioRow.innerHTML = `
        <td>责任比例</td>
        <td>${(results.responsibilityRatio * 100).toFixed(0)}%</td>
    `;
    tableBody.appendChild(ratioRow);
    
    // 添加总计行
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    totalRow.innerHTML = `
        <td>应赔偿总额</td>
        <td>${formatCurrency(results.adjustedTotal)}</td>
    `;
    tableBody.appendChild(totalRow);
    
    resultTable.appendChild(tableBody);
    resultContainer.appendChild(resultTable);
}

// 格式化货币
function formatCurrency(value) {
    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// 绑定导出PDF按钮事件
function bindExportButton() {
    const exportButton = document.querySelector('.export-btn');
    
    exportButton.addEventListener('click', function() {
        exportToPDF();
    });
}

// 导出为PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    
    // 创建PDF实例
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // 获取结果容器
    const resultContainer = document.getElementById('result-container');
    
    // 使用html2canvas将结果容器转为图片
    html2canvas(resultContainer).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        // 添加标题
        pdf.setFontSize(20);
        pdf.text('交通事故赔偿计算结果', 105, 15, { align: 'center' });
        
        // 添加图片
        pdf.addImage(imgData, 'PNG', 10, 30, imgWidth, imgHeight);
        
        // 添加页脚
        pdf.setFontSize(10);
        pdf.text('本计算结果仅供参考，实际赔偿请以法院判决为准', 105, 285, { align: 'center' });
        
        // 保存PDF
        pdf.save('交通事故赔偿计算结果.pdf');
    });
} 