import{_ as e,c as t,o,Q as s}from"./chunks/framework.989a1717.js";const F=JSON.parse('{"title":"Field","description":"","frontmatter":{},"headers":[],"relativePath":"reference/field.md","lastUpdated":1679042802000}'),d={name:"reference/field.md"},a=s(`<h1 id="field" tabindex="-1">Field <a class="header-anchor" href="#field" aria-label="Permalink to &quot;Field&quot;">​</a></h1><p>A field is the primitive for every input that you&#39;d like to display to the user. This is what an example <code>Field</code> looks like:</p><div class="language-jsx"><button title="Copy Code" class="copy"></button><span class="lang">jsx</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">Field</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">&gt; </span><span style="color:#C792EA;">name</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">username</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">initialValue</span><span style="color:#89DDFF;">={</span><span style="color:#89DDFF;">&quot;&quot;</span><span style="color:#89DDFF;">}&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{({</span><span style="color:#A6ACCD;font-style:italic;">value</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">setValue</span><span style="color:#89DDFF;">})</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> (</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">input</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">value</span><span style="color:#89DDFF;">={</span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">} </span><span style="color:#C792EA;">onChange</span><span style="color:#89DDFF;">={</span><span style="color:#A6ACCD;font-style:italic;">e</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">setValue</span><span style="color:#A6ACCD;">(e</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">target</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">value)</span><span style="color:#89DDFF;">} </span><span style="color:#C792EA;">placeholder</span><span style="color:#89DDFF;">={</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Username</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">}/&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    )</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#FFCB6B;">Field</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div><h2 id="field-props" tabindex="-1">Field Props <a class="header-anchor" href="#field-props" aria-label="Permalink to &quot;Field Props&quot;">​</a></h2><table><thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead><tbody><tr><td><code>name</code></td><td><code>string</code></td><td>The name of the field in the form.</td></tr><tr><td><code>initialValue</code></td><td><code>T</code></td><td>The initial value of the form field.</td></tr><tr><td><code>listenTo</code></td><td><code>string[]</code></td><td>A list of form field names to listen to. When a listened field updates it&#39;s value, it will trigger the relevant <code>onChangeValidation</code> change detection. Useful when making one field depend on the validation of another.</td></tr><tr><td><code>children</code></td><td><code>(props: FieldInstance&lt;T&gt;) =&gt; JSX.Element</code></td><td>Passed <a href="#interface-fieldinstance"><code>FieldInstance</code></a>, expected to return a JSX element.</td></tr><tr><td><code>onChangeValidate</code></td><td><code>() =&gt; Promise&lt;boolean&gt;</code> or <a href="https://github.com/colinhacks/zod" target="_blank" rel="noreferrer"><code>ZodType</code></a></td><td>The validation logic for when the user has changed the field value. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error.</td></tr><tr><td><code>onBlurValidate</code></td><td><code>() =&gt; Promise&lt;boolean&gt;</code> or <a href="https://github.com/colinhacks/zod" target="_blank" rel="noreferrer"><code>ZodType</code></a></td><td>The validation logic for when the user has blurred the field. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error.</td></tr><tr><td><code>onMountValidate</code></td><td><code>() =&gt; Promise&lt;boolean&gt;</code> or <a href="https://github.com/colinhacks/zod" target="_blank" rel="noreferrer"><code>ZodType</code></a></td><td>The validation logic for when the component is mounted. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error.</td></tr><tr><td><code>onSubmitValidate</code></td><td><code>() =&gt; Promise&lt;boolean&gt;</code> or <a href="https://github.com/colinhacks/zod" target="_blank" rel="noreferrer"><code>ZodType</code></a></td><td>The validation logic for when the user has submitted the form. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error.</td></tr><tr><td><code>memoChild</code></td><td><code>any[]</code></td><td>An array of items passed to the inner <code>useMemo</code> <a href="/guides/performance-optimizations.html">which helps prevent re-renders on the field.</a></td></tr></tbody></table><h3 id="interface-fieldinstance" tabindex="-1"><em>Interface</em> <code>FieldInstance</code> <a class="header-anchor" href="#interface-fieldinstance" aria-label="Permalink to &quot;_Interface_ \`FieldInstance\`&quot;">​</a></h3><table><thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead><tbody><tr><td><code>value</code></td><td><code>T</code></td><td><code>T</code> is the type of the Field that&#39;s passed to the <code>&lt;Field&lt;T&gt;&gt;</code> component.</td></tr><tr><td><code>setValue</code></td><td><code>(val: T) =&gt; void</code></td><td>A function useful to change the value of a field</td></tr><tr><td><code>onBlur</code></td><td><code>() =&gt; void</code></td><td>A function expected to be passed to the <code>onBlur</code> element property.</td></tr><tr><td><code>errors</code></td><td><code>string[]</code></td><td>The list of errors currently applied to the field.</td></tr><tr><td><code>setErrors</code></td><td><code>(errors: string[]) =&gt; void</code></td><td>A way to set the errors present on the field.</td></tr><tr><td><code>isValid</code></td><td><code>boolean</code></td><td>A helper property to check if <code>errors</code> is an empty array.</td></tr><tr><td><code>isTouched</code></td><td><code>boolean</code></td><td>A boolean to say if the field has been focused and blurred, regardless of user input.</td></tr><tr><td><code>setIsTouched</code></td><td><code>(val: boolean) =&gt; void</code></td><td></td></tr><tr><td><code>isDirty</code></td><td><code>boolean</code></td><td>A boolean to say if the field has had any kind of user input.</td></tr><tr><td><code>setIsDirty</code></td><td><code>(val: boolean) =&gt; void</code></td><td></td></tr><tr><td><code>props</code></td><td><a href="#field-props"><code>FieldProps</code></a></td><td>The properties originally passed to a field from the component.</td></tr></tbody></table>`,7),r=[a];function n(l,c,i,p,h,y){return o(),t("div",null,r)}const D=e(d,[["render",n]]);export{F as __pageData,D as default};
