// 版（公開のたびに上げる。JS と CSS の読みこみに ?v= で付く）
export const VERSION = '1.0.3';
export const SPEEDS = [1, 2, 5, 10, 25, 50, 100];
export const COUNTS = [1, 4, 9, 25, 100];
export const SITE_URL = 'https://9qu1.com/ikitemita/';

// みんなの数（Cloudflare Workers・worker/）。?api= で手元の wrangler dev に向けられる
const q = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
export const COUNTER_API = q.get('api') || 'https://ikitemita.nakamido.workers.dev';
// 数えるのは本番（9qu1.com）で押されたときと、?api= で試すときだけ（手元の確認で数がふえないように）
export const COUNT_ON = typeof location !== 'undefined' && (location.hostname === '9qu1.com' || q.has('api'));
