/**
 * 交通事故赔偿计算工具 - 数据文件
 * 包含：地区数据、赔偿标准参数
 */

// 地区数据 (省份和城市)
const regionData = {
    provinces: [
        {
            name: "北京市",
            code: "110000",
            cities: [{ name: "北京市", code: "110100" }]
        },
        {
            name: "上海市",
            code: "310000",
            cities: [{ name: "上海市", code: "310100" }]
        },
        {
            name: "广东省",
            code: "440000",
            cities: [
                { name: "广州市", code: "440100" },
                { name: "深圳市", code: "440300" },
                { name: "佛山市", code: "440600" },
                { name: "东莞市", code: "441900" },
                { name: "中山市", code: "442000" }
            ]
        },
        {
            name: "江苏省",
            code: "320000",
            cities: [
                { name: "南京市", code: "320100" },
                { name: "无锡市", code: "320200" },
                { name: "苏州市", code: "320500" }
            ]
        },
        {
            name: "浙江省",
            code: "330000",
            cities: [
                { name: "杭州市", code: "330100" },
                { name: "宁波市", code: "330200" },
                { name: "温州市", code: "330300" }
            ]
        },
        {
            name: "四川省",
            code: "510000",
            cities: [
                { name: "成都市", code: "510100" },
                { name: "绵阳市", code: "510700" },
                { name: "南充市", code: "511300" }
            ]
        }
    ]
};

// 2023年各省市人均收入和消费数据 (示例数据，实际使用时需更新为准确数据)
const incomeData = {
    // 北京
    "110100": {
        urban: {
            averageAnnualIncome: 96000, // 城镇居民年平均收入（元）
            averageAnnualConsumption: 48000 // 城镇居民年平均消费（元）
        },
        rural: {
            averageAnnualIncome: 38000, // 农村居民年平均收入（元）
            averageAnnualConsumption: 22000 // 农村居民年平均消费（元）
        },
        dailyAllowance: 120, // 伙食补助费标准（元/天）
        travelAllowance: 1500 // 交通住宿费用合理限额（元/天）
    },
    // 上海
    "310100": {
        urban: {
            averageAnnualIncome: 94000,
            averageAnnualConsumption: 47000
        },
        rural: {
            averageAnnualIncome: 37000,
            averageAnnualConsumption: 21000
        },
        dailyAllowance: 120,
        travelAllowance: 1500
    },
    // 广州
    "440100": {
        urban: {
            averageAnnualIncome: 78000,
            averageAnnualConsumption: 39000
        },
        rural: {
            averageAnnualIncome: 32000,
            averageAnnualConsumption: 18000
        },
        dailyAllowance: 100,
        travelAllowance: 1200
    },
    // 深圳
    "440300": {
        urban: {
            averageAnnualIncome: 84000,
            averageAnnualConsumption: 42000
        },
        rural: {
            averageAnnualIncome: 34000,
            averageAnnualConsumption: 19000
        },
        dailyAllowance: 110,
        travelAllowance: 1300
    },
    // 默认数据（当没有特定城市数据时使用）
    "default": {
        urban: {
            averageAnnualIncome: 65000,
            averageAnnualConsumption: 32500
        },
        rural: {
            averageAnnualIncome: 28000,
            averageAnnualConsumption: 16000
        },
        dailyAllowance: 80,
        travelAllowance: 1000
    }
};

// 责任比例范围
const responsibilityRatio = {
    "full": 1.0, // 全责 100%
    "main": 0.75, // 主责 平均取75%
    "minor": 0.35, // 次责 平均取35%
    "none": 0.0 // 无责 0%
};

// 伤残等级赔偿系数
const disabilityCoefficient = {
    "1": 1.0, // 一级伤残
    "2": 0.9, // 二级伤残
    "3": 0.8, // 三级伤残
    "4": 0.7, // 四级伤残
    "5": 0.6, // 五级伤残
    "6": 0.5, // 六级伤残
    "7": 0.4, // 七级伤残
    "8": 0.3, // 八级伤残
    "9": 0.2, // 九级伤残
    "10": 0.1 // 十级伤残
};

// 赔偿年限 (根据年龄计算)
function calculateCompensationYears(age) {
    if (age >= 60) {
        return 5; // 60岁以上，按5年计算
    } else if (age >= 55) {
        return 10; // 55-59岁，按10年计算
    } else if (age >= 45) {
        return 15; // 45-54岁，按15年计算
    } else {
        return 20; // 45岁以下，按20年计算
    }
}

// 导出数据
window.compensationData = {
    regionData,
    incomeData,
    responsibilityRatio,
    disabilityCoefficient,
    calculateCompensationYears
}; 