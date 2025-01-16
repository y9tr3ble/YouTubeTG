import { en } from './translations/en';
import { ru } from './translations/ru';
import { Context } from 'grammy';
import { SettingsService } from '../services/settings.service';

type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export class I18nService {
    private static instance: I18nService;
    private translations: { [key: string]: DeepPartial<typeof en> } = {
        en,
        ru
    };
    private settingsService: SettingsService;

    private constructor() {
        this.settingsService = SettingsService.getInstance();
    }

    public static getInstance(): I18nService {
        if (!I18nService.instance) {
            I18nService.instance = new I18nService();
        }
        return I18nService.instance;
    }

    public async t(ctx: Context, key: string, params: { [key: string]: string } = {}): Promise<string> {
        let lang = 'en';
        
        if (ctx.from?.id) {
            const settings = await this.settingsService.getUserSettings(ctx.from.id);
            lang = settings.language === 'ru' ? 'ru' : 'en';
        }
        
        let translation = this.getNestedTranslation(this.translations[lang], key);
        
        if (!translation) {
            translation = this.getNestedTranslation(this.translations['en'], key);
        }

        return this.interpolateParams(translation || key, params);
    }

    private getNestedTranslation(obj: any, path: string): string {
        return path.split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : null;
        }, obj);
    }

    private interpolateParams(text: string, params: { [key: string]: string }): string {
        return Object.entries(params).reduce((acc, [key, value]) => {
            return acc.replace(`\${${key}}`, value);
        }, text);
    }
}
