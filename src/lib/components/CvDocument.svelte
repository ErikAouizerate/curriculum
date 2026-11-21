<script lang="ts">
  import CvHeader from "#lib/components/CvHeader.svelte";
  import CvJob from "#lib/components/CvJob.svelte";
  import CvSection from "#lib/components/CvSection.svelte";
  import CvSkill from "#lib/components/CvSkill.svelte";
  import type { CvActions, CvView } from "#lib/cv.js";

  interface Props {
    view: CvView;
    editable?: boolean;
    actions?: CvActions;
    /**
     * False renders the header only. The header never depends on the CV state, so a page can
     * paint it (and take part in view transitions) before it knows which content to show.
     */
    showContent?: boolean;
    /** The CV is the whole page (`/`, `/studio`), not a preview: project thumbnails in the margin. */
    fullPage?: boolean;
    /** Room above the title for floating actions shown at the top until they fit beside the sheet. */
    headerSpace?: boolean;
  }

  let { view, editable = false, actions, showContent = true, fullPage = false, headerSpace = false }: Props = $props();

  const canEdit = $derived(editable && actions !== undefined);
</script>

<div
  id="cv-page"
  class="cv-document relative md:w-[21cm] md:max-w-full bg-stone-200 print:bg-white min-h-[29.7cm] print:min-h-[29.7cm]"
>
  <CvHeader actionsSpace={headerSpace} />

  {#if showContent}
    <main class="bg-white h-full pt-4">
      <CvSection
        icon="skills"
        title="Compétences"
        editable={canEdit}
        onShowAll={actions?.showAllSkills}
        onReset={actions?.resetSkills}
        onRemoveAll={actions?.removeAllSkills}
      >
        <div class="grid grid-cols-2 md:grid-cols-4 print:grid-cols-4 gap-4 md:gap-px pt-6">
          {#each view.categories as category (category.key)}
            <CvSkill
              title={category.title}
              skills={category.skills}
              editable={canEdit}
              onRemove={actions?.removeSkill}
            />
          {/each}
        </div>
      </CvSection>

      <CvSection
        icon="jobs"
        title="Expériences professionnelles"
        editable={canEdit}
        onShowAll={actions?.showAllJobs}
        onReset={actions?.resetJobs}
      >
        {#each view.jobs as item (item.index)}
          <CvJob
            job={item.job}
            mode={item.mode}
            projects={fullPage ? item.projects : []}
            editable={canEdit}
            onRemove={() => actions?.removeJob(item.index)}
            onToggleSmall={() => actions?.toggleSmall(item.index)}
            onAddSkills={(keepCurrent) => actions?.addSkills(item.index, keepCurrent)}
          />
        {/each}
      </CvSection>

      <CvSection icon="schools" title="Formations">
        <div class="print:py-2 py-6">
          {#each view.schools as school, index (index)}
            <div class="mb-2 last-of-type:mb-0">
              <div
                class="flex flex-col items-start md:float-left md:-ml-14 print:float-left print:-ml-14"
              >
                <div>{school.year}</div>
              </div>
              <h3 class="text-[0.88rem] font-bold">
                {school.title}
                <span class="font-normal">– {school.school}</span>
              </h3>
              {#if school.subtitle}
                <h4 class="text-[0.88rem] text-gray-700">{school.subtitle}</h4>
              {/if}
            </div>
          {/each}
        </div>
      </CvSection>
    </main>
  {/if}
</div>
