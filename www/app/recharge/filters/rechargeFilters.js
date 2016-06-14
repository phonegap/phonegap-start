var rechargeFilters= angular.module('rechargeFilters', []);

rechargeFilters.filter('convertEnglishToPersian', function () {  
    return function(englishName){
        var persianName;
        switch (englishName){
            case 'MTN':
                persianName= 'ایرانسل';
                break;
            case 'MCI':
                persianName= 'همراه اول';
                break;
            case 'mobile':
                persianName= 'موبایل';
                break;
            case 'wimax':
                persianName= 'وایمکس';
                break;
            case 'prepaid':
                persianName= 'اعتباری';
                break;
            case 'postpaid':
                persianName= 'دائمی';
                break;
            case 'normal':
                persianName= 'عادی';
                break;
            case 'wow':
                persianName= 'شگفت انگیز';
                break;
            case 'additivePackages':
                persianName= 'بسته های افزایشی 3G';
                break;
            default:
                persianName= '';
                break;
        }
        return persianName;
    }
})