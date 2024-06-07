import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import dts from 'vite-plugin-dts';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const isProduction = mode === 'production';
	return {
		root: isProduction ? undefined : 'stories',
		plugins: [
			react(),
			viteTsconfigPaths(),
			dts({
				tsconfigPath: 'tsconfig.json',
				insertTypesEntry: true,
				outDir: 'dist/types',
				cleanVueFileName: true,
				staticImport: true,
			}),
			cssInjectedByJsPlugin(),
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		build: {
			lib: {
				entry: path.resolve('src/index.ts'),
				name: 'use-apollo-infinite-scroll',
				fileName: (format) => `use-apollo-infinite-scroll.${format}.js`,
			},
			rollupOptions: {
				external: ['react', 'react-dom'],
				output: {
					globals: {
						react: 'React',
						'react-dom': 'ReactDOM',
					},
				},
			},
		},
		server: {
			port: 4000,
		},
	};
});
