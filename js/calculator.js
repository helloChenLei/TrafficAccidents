/**
 * 交通事故赔偿计算工具 - 计算逻辑
 * 包含各项赔偿费用的计算方法
 */

class CompensationCalculator {
    constructor(formData, compensationData) {
        this.formData = formData;
        this.compensationData = compensationData;
        this.results = {};
    }

    // 获取责任比例
    getResponsibilityRatio() {
        return this.compensationData.responsibilityRatio[this.formData.responsibility];
    }

    // 获取城市数据
    getCityData() {
        const cityCode = this.formData.city;
        return this.compensationData.incomeData[cityCode] || this.compensationData.incomeData.default;
    }

    // 获取年收入
    getAnnualIncome() {
        const cityData = this.getCityData();
        const household = this.formData.household;
        
        // 如果有固定收入
        if (this.formData.incomeType === 'fixed' && this.formData.monthlyIncome) {
            return this.formData.monthlyIncome * 12;
        }
        
        // 如果有平均收入
        if (this.formData.incomeType === 'non-fixed' && this.formData.averageIncome) {
            return this.formData.averageIncome * 12;
        }
        
        // 否则使用当地平均收入
        return cityData[household].averageAnnualIncome;
    }

    // 计算医疗费
    calculateMedicalExpenses() {
        return this.formData.medicalExpenses || 0;
    }

    // 计算误工费
    calculateWorkOffCompensation() {
        const dailyIncome = this.getAnnualIncome() / 365;
        return dailyIncome * (this.formData.workOffDays || 0);
    }

    // 计算护理费
    calculateNursingCare() {
        if (this.formData.nursingCare !== 'yes' || !this.formData.nursingDays) {
            return 0;
        }
        
        const cityData = this.getCityData();
        const dailyNursingFee = this.formData.nurseHasIncome === 'yes' 
            ? this.getAnnualIncome() / 365 
            : cityData[this.formData.household].averageAnnualIncome / 365 / 2;
            
        return dailyNursingFee * this.formData.nursingDays;
    }

    // 计算交通费
    calculateTransportationFee() {
        return this.formData.transportationFee || 0;
    }

    // 计算住宿费
    calculateAccommodationFee() {
        return this.formData.accommodationFee || 0;
    }

    // 计算伙食补助费
    calculateFoodAllowance() {
        const cityData = this.getCityData();
        const dailyAllowance = cityData.dailyAllowance;
        return dailyAllowance * (this.formData.hospitalDays || 0);
    }

    // 计算营养费
    calculateNutritionFee() {
        // 按照每天25元计算
        return 25 * (this.formData.hospitalDays || 0);
    }

    // 计算残疾赔偿金
    calculateDisabilityCompensation() {
        if (this.formData.injuryType !== 'disability' || !this.formData.disabilityLevel) {
            return 0;
        }
        
        const annualIncome = this.getAnnualIncome();
        const disabilityCoefficient = this.compensationData.disabilityCoefficient[this.formData.disabilityLevel];
        const compensationYears = this.compensationData.calculateCompensationYears(this.formData.age);
        
        return annualIncome * disabilityCoefficient * compensationYears;
    }

    // 计算死亡赔偿金
    calculateDeathCompensation() {
        if (this.formData.injuryType !== 'death') {
            return 0;
        }
        
        const annualIncome = this.getAnnualIncome();
        const compensationYears = this.compensationData.calculateCompensationYears(this.formData.age);
        
        return annualIncome * compensationYears;
    }

    // 计算丧葬费
    calculateFuneralExpenses() {
        if (this.formData.injuryType !== 'death') {
            return 0;
        }
        
        const cityData = this.getCityData();
        const monthlyIncome = cityData[this.formData.household].averageAnnualIncome / 12;
        
        // 按照6个月工资计算
        return monthlyIncome * 6;
    }

    // 计算被扶养人生活费
    calculateDependentsLivingExpenses() {
        if ((this.formData.injuryType !== 'death' && this.formData.injuryType !== 'disability') || 
            !this.formData.dependents || this.formData.dependents <= 0) {
            return 0;
        }
        
        const cityData = this.getCityData();
        const annualConsumption = cityData[this.formData.household].averageAnnualConsumption;
        
        // 计算扶养年限 (简化为固定20年)
        const supportYears = 20;
        
        // 如果是伤残，根据伤残等级调整
        let coefficient = 1.0;
        if (this.formData.injuryType === 'disability' && this.formData.disabilityLevel) {
            coefficient = this.compensationData.disabilityCoefficient[this.formData.disabilityLevel];
        }
        
        return annualConsumption * this.formData.dependents * supportYears * coefficient;
    }

    // 计算财产损失
    calculatePropertyLoss() {
        let propertyLoss = 0;
        
        // 车辆维修费
        propertyLoss += this.formData.vehicleRepair || 0;
        
        // 物品损失
        propertyLoss += this.formData.propertyLoss || 0;
        
        // 施救费用
        propertyLoss += this.formData.rescueCost || 0;
        
        // 经营性损失
        if (this.formData.businessVehicle === 'yes' && this.formData.businessLoss && this.formData.businessDays) {
            propertyLoss += this.formData.businessLoss * this.formData.businessDays;
        }
        
        return propertyLoss;
    }

    // 计算精神损害赔偿
    calculateMentalDamage() {
        return this.formData.mentalDamage || 0;
    }

    // 计算鉴定费和诉讼费
    calculateLegalFees() {
        return (this.formData.appraisalFee || 0) + (this.formData.litigationFee || 0);
    }

    // 计算总赔偿金额
    calculateTotalCompensation() {
        // 计算各项赔偿
        this.results = {
            medicalExpenses: this.calculateMedicalExpenses(),
            workOffCompensation: this.calculateWorkOffCompensation(),
            nursingCare: this.calculateNursingCare(),
            transportationFee: this.calculateTransportationFee(),
            accommodationFee: this.calculateAccommodationFee(),
            foodAllowance: this.calculateFoodAllowance(),
            nutritionFee: this.calculateNutritionFee(),
            disabilityCompensation: this.calculateDisabilityCompensation(),
            deathCompensation: this.calculateDeathCompensation(),
            funeralExpenses: this.calculateFuneralExpenses(),
            dependentsLivingExpenses: this.calculateDependentsLivingExpenses(),
            propertyLoss: this.calculatePropertyLoss(),
            mentalDamage: this.calculateMentalDamage(),
            legalFees: this.calculateLegalFees()
        };
        
        // 计算总和
        let total = 0;
        for (const key in this.results) {
            total += this.results[key];
        }
        
        // 应用责任比例
        const responsibilityRatio = this.getResponsibilityRatio();
        const adjustedTotal = total * responsibilityRatio;
        
        this.results.total = total;
        this.results.responsibilityRatio = responsibilityRatio;
        this.results.adjustedTotal = adjustedTotal;
        
        return this.results;
    }
}

// 导出计算器
window.CompensationCalculator = CompensationCalculator; 